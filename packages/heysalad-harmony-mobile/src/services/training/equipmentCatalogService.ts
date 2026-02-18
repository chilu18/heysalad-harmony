import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
  getDocs,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import Constants from 'expo-constants';
import { db, storage } from '../firebase/config';
import {
  BEUMER_EQUIPMENT_CATALOG,
  TRAINING_REQUIREMENTS,
  EquipmentCategory,
  slugify,
} from '../../constants/beumerEquipment';

const expoExtra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

const selectCredential = (...values: (string | undefined | null)[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
};

const ELEVEN_LABS_API_KEY = selectCredential(
  process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY,
  expoExtra.elevenLabsApiKey as string | undefined
);

const ELEVEN_LABS_VOICE_ID = selectCredential(
  process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID,
  expoExtra.elevenLabsVoiceId as string | undefined
);

const ELEVEN_LABS_BASE_URL = 'https://api.elevenlabs.io';

const seedEquipmentCategory = (
  batch: ReturnType<typeof writeBatch>,
  category: EquipmentCategory
) => {
  const categoryRef = doc(collection(db, 'equipmentCategories'), category.id);
  batch.set(
    categoryRef,
    {
      title: category.title,
      description: category.description ?? '',
      source: 'beumer',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    },
    { merge: true }
  );

  const itemsCollection = collection(categoryRef, 'items');

  category.equipment.forEach((item) => {
    const trainingMatch = TRAINING_REQUIREMENTS.find(
      (req) => slugify(req.equipmentCategory) === item.id
    );

    const trainingReferenceId = trainingMatch ? slugify(trainingMatch.equipmentCategory) : null;
    const itemRef = doc(itemsCollection, item.id);
    batch.set(
      itemRef,
      {
        name: item.name,
        description: item.description ?? '',
        trainingRequirementId: trainingReferenceId,
        ttsStatus: 'pending',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );
  });
};

export const EquipmentCatalogService = {
  syncBeumerCatalog: async () => {
    const batch = writeBatch(db);
    BEUMER_EQUIPMENT_CATALOG.forEach((category) => {
      seedEquipmentCategory(batch, category);
    });

    TRAINING_REQUIREMENTS.forEach((requirement) => {
      const requirementRef = doc(collection(db, 'trainingRequirements'), slugify(requirement.equipmentCategory));
      batch.set(
        requirementRef,
        {
          title: requirement.equipmentCategory,
          duration: requirement.durationDays,
          components: requirement.components,
          certifications: requirement.certifications,
          source: 'beumer',
          updatedAt: serverTimestamp(),
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );
    });

    await batch.commit();
  },

  generateTtsForEquipment: async (categoryId: string, itemId: string) => {
    if (!ELEVEN_LABS_API_KEY) {
      throw new Error('Missing ElevenLabs API key');
    }

    const voiceId = ELEVEN_LABS_VOICE_ID;
    if (!voiceId) {
      throw new Error('Missing ElevenLabs voice id');
    }

    const categoryRef = doc(db, 'equipmentCategories', categoryId);
    const itemRef = doc(collection(categoryRef, 'items'), itemId);
    const itemSnapshot = await getDoc(itemRef);
    if (!itemSnapshot.exists()) {
      throw new Error(`Equipment item ${categoryId}/${itemId} not found`);
    }

    const itemData = itemSnapshot.data();
    const displayName = itemData.name ?? itemId;
    const trainingRequirement = TRAINING_REQUIREMENTS.find(
      (req) => slugify(req.equipmentCategory) === (itemData.trainingRequirementId ?? itemId)
    );

    const trainingSummary = trainingRequirement
      ? `Training duration ${trainingRequirement.durationDays}. Key components include ${trainingRequirement.components.join(
          ', '
        )}. Required certifications: ${trainingRequirement.certifications.join(', ')}.`
      : 'Training details will be provided by your Bereit team.';

    const narration = `${displayName}. ${trainingSummary}`;

    const response = await fetch(`${ELEVEN_LABS_BASE_URL}/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY,
        Accept: 'audio/mpeg',
      },
      body: JSON.stringify({
        text: narration,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to generate TTS (status ${response.status}): ${errorBody}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const audioBytes = new Uint8Array(audioBuffer);
    const storagePath = `equipment-audio/${categoryId}/${itemId}.mp3`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, audioBytes, {
      contentType: 'audio/mpeg',
    });

    const downloadUrl = await getDownloadURL(storageRef);

    await updateDoc(itemRef, {
      ttsStatus: 'ready',
      audioStoragePath: storagePath,
      audioUrl: downloadUrl,
      ttsUpdatedAt: serverTimestamp(),
    });

    return {
      audioUrl: downloadUrl,
      storagePath,
    };
  },

  generateTtsForCategory: async (categoryId: string) => {
    const itemQuery = await getDocs(collection(db, 'equipmentCategories', categoryId, 'items'));
    const results: { itemId: string; audioUrl?: string }[] = [];

    for (const docSnapshot of itemQuery.docs) {
      try {
        const { audioUrl } = await EquipmentCatalogService.generateTtsForEquipment(
          categoryId,
          docSnapshot.id
        );
        results.push({ itemId: docSnapshot.id, audioUrl });
      } catch (error) {
        results.push({ itemId: docSnapshot.id });
        console.error(`TTS generation failed for ${docSnapshot.id}:`, error);
        await updateDoc(docSnapshot.ref, {
          ttsStatus: 'error',
          ttsError: error instanceof Error ? error.message : String(error),
          ttsUpdatedAt: serverTimestamp(),
        });
      }
    }

    return results;
  },
};
