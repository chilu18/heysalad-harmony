import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  writeBatch,
  onSnapshot,
  DocumentData
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import catalogSource from '../data/beumerEquipment.json';
import { logEvent, logError } from './loggingService';

const CATALOG_COLLECTION = 'trainingCatalog';
const CATALOG_DOC_ID = 'beumer';
const PROGRAMS_COLLECTION = 'trainingPrograms';
const PROGRESS_COLLECTION = 'trainingProgress';

export interface TrainingProgram {
  id: string;
  title: string;
  categoryId: string;
  categoryLabel: string;
  segment: string;
  durationDaysMin: number;
  durationDaysMax: number;
  topics: string[];
  certificationsRequired: string[];
  catalogSource: string;
  catalogVersion: number;
  updatedAt: string;
}

export interface TrainingProgress {
  id: string;
  userId: string;
  programId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercent: number;
  lastAccessedAt: string;
  completedAt?: string;
  llmModule?: {
    script: string;
    audioUrl?: string | null;
    generatedAt: string;
  };
}

export interface TrainingProgramWithProgress extends TrainingProgram {
  progress?: TrainingProgress;
}

export interface TrainingCatalogPayload {
  metadata: {
    source: string;
    generatedAt: string;
    version: number;
  };
  equipmentCategories: Array<{
    id: string;
    label: string;
    segment: string;
    trainingPrograms?: Array<{
      id: string;
      title: string;
      durationDays: { min: number; max: number };
      topics: string[];
      certificationsRequired: string[];
    }>;
  }>;
  trainingRefreshers: Array<{ id: string; title: string; frequency: string }>;
  generalSafety: {
    personalProtectiveEquipment: { mandatory: string[]; taskSpecific: string[] };
    preOperationRequirements: string[];
  };
  maintenanceSafetyProtocols: unknown;
  emergencyResponse: unknown;
  regulatoryStandards: unknown;
  implementationNotes: string[];
}

const isTrainingCatalogPayload = (value: unknown): value is TrainingCatalogPayload => {
  if (!value || typeof value !== 'object') return false;
  const payload = value as TrainingCatalogPayload;
  return Array.isArray(payload.equipmentCategories) && Array.isArray(payload.trainingRefreshers);
};

const normalizeProgramId = (categoryId: string, rawId: string) =>
  `${categoryId}__${rawId}`.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();

const toIsoString = (date: Date | Timestamp) => {
  if (date instanceof Timestamp) {
    return date.toDate().toISOString();
  }
  return date.toISOString();
};

const mapCatalogToPrograms = (catalog: TrainingCatalogPayload): TrainingProgram[] => {
  const programs: TrainingProgram[] = [];
  const catalogVersion = catalog.metadata?.version ?? 1;
  const catalogSourceLabel = catalog.metadata?.source ?? 'BEUMER Equipment Catalog';
  const timestamp = new Date().toISOString();

  for (const category of catalog.equipmentCategories) {
    const trainingPrograms = category.trainingPrograms ?? [];
    for (const program of trainingPrograms) {
      programs.push({
        id: normalizeProgramId(category.id, program.id),
        title: program.title,
        categoryId: category.id,
        categoryLabel: category.label,
        segment: category.segment,
        durationDaysMin: program.durationDays.min,
        durationDaysMax: program.durationDays.max,
        topics: program.topics,
        certificationsRequired: program.certificationsRequired,
        catalogSource: catalogSourceLabel,
        catalogVersion,
        updatedAt: timestamp
      });
    }
  }

  return programs;
};

export const syncBeumerTrainingCatalog = async () => {
  logEvent('info', 'Starting BEUMER training catalog sync');

  if (!isTrainingCatalogPayload(catalogSource)) {
    throw new Error('Invalid catalog payload – unable to sync training catalog');
  }

  const catalog = catalogSource as TrainingCatalogPayload;
  const programs = mapCatalogToPrograms(catalog);

  const batch = writeBatch(db);

  const catalogRef = doc(db, CATALOG_COLLECTION, CATALOG_DOC_ID);
  batch.set(catalogRef, {
    ...catalog,
    syncedAt: serverTimestamp()
  });

  const existingPrograms = await getDocs(collection(db, PROGRAMS_COLLECTION));
  for (const existing of existingPrograms.docs) {
    batch.delete(existing.ref);
  }

  for (const program of programs) {
    const programRef = doc(db, PROGRAMS_COLLECTION, program.id);
    batch.set(programRef, {
      ...program,
      updatedAt: serverTimestamp()
    });
  }

  await batch.commit();

  logEvent('info', 'Completed BEUMER training catalog sync', {
    programCount: programs.length
  });

  return programs.length;
};

export const fetchTrainingCatalog = async (): Promise<TrainingCatalogPayload> => {
  const docRef = doc(db, CATALOG_COLLECTION, CATALOG_DOC_ID);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    const data = snapshot.data();
    if (isTrainingCatalogPayload(data)) {
      return data;
    }
  }

  if (!isTrainingCatalogPayload(catalogSource)) {
    throw new Error('Training catalog payload is malformed');
  }

  return catalogSource;
};

export const fetchTrainingPrograms = async (): Promise<TrainingProgram[]> => {
  const q = query(collection(db, PROGRAMS_COLLECTION), orderBy('categoryLabel'));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    if (!isTrainingCatalogPayload(catalogSource)) {
      throw new Error('Training catalog payload is malformed');
    }
    return mapCatalogToPrograms(catalogSource);
  }

  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() as DocumentData;
    return {
      id: docSnapshot.id,
      title: data.title,
      categoryId: data.categoryId,
      categoryLabel: data.categoryLabel,
      segment: data.segment,
      durationDaysMin: data.durationDaysMin,
      durationDaysMax: data.durationDaysMax,
      topics: data.topics ?? [],
      certificationsRequired: data.certificationsRequired ?? [],
      catalogSource: data.catalogSource,
      catalogVersion: data.catalogVersion,
      updatedAt: data.updatedAt ? toIsoString(data.updatedAt) : new Date().toISOString()
    };
  });
};

export const fetchUserTrainingProgress = async (userId: string): Promise<Record<string, TrainingProgress>> => {
  const progressCollection = collection(db, PROGRESS_COLLECTION);
  const progressQuery = query(progressCollection, where('userId', '==', userId));
  const snapshot = await getDocs(progressQuery);

  const result: Record<string, TrainingProgress> = {};

  snapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data() as DocumentData;
    const progress: TrainingProgress = {
      id: docSnapshot.id,
      userId: data.userId,
      programId: data.programId,
      status: data.status ?? 'not_started',
      progressPercent: data.progressPercent ?? 0,
      lastAccessedAt: data.lastAccessedAt ? toIsoString(data.lastAccessedAt) : new Date().toISOString(),
      completedAt: data.completedAt ? toIsoString(data.completedAt) : undefined,
      llmModule: data.llmModule
        ? {
            script: data.llmModule.script,
            audioUrl: data.llmModule.audioUrl ?? null,
            generatedAt: data.llmModule.generatedAt ? toIsoString(data.llmModule.generatedAt) : new Date().toISOString()
          }
        : undefined
    };
    result[progress.programId] = progress;
  });

  return result;
};

export const fetchProgramsWithProgress = async (
  userId: string | null | undefined
): Promise<TrainingProgramWithProgress[]> => {
  const [programs, progressMap] = await Promise.all([
    fetchTrainingPrograms(),
    userId ? fetchUserTrainingProgress(userId) : Promise.resolve({} as Record<string, TrainingProgress>)
  ]);

  return programs.map((program) => ({
    ...program,
    progress: userId ? progressMap[program.id] : undefined
  }));
};

export const updateTrainingProgress = async (
  userId: string,
  programId: string,
  updates: Partial<Omit<TrainingProgress, 'id' | 'userId' | 'programId' | 'lastAccessedAt' | 'llmModule'>> & {
    llmModule?: { script: string; audioUrl?: string | null };
  }
) => {
  const progressDocId = `${userId}__${programId}`;
  const progressRef = doc(db, PROGRESS_COLLECTION, progressDocId);
  const now = serverTimestamp();

  const payload: Record<string, unknown> = {
    userId,
    programId,
    lastAccessedAt: now
  };

  if (updates.status) {
    payload.status = updates.status;
  }

  if (typeof updates.progressPercent === 'number') {
    payload.progressPercent = updates.progressPercent;
  }

  if (updates.completedAt) {
    payload.completedAt = updates.completedAt;
  }

  if (updates.llmModule) {
    payload.llmModule = {
      script: updates.llmModule.script,
      audioUrl: updates.llmModule.audioUrl ?? null,
      generatedAt: now
    };
  }

  await setDoc(progressRef, payload, { merge: true });
};

export const uploadTrainingAudio = async (
  userId: string,
  programId: string,
  audioBlob: Blob
): Promise<string> => {
  const storagePath = `training-modules/${userId}/${programId}-${Date.now()}.mp3`;
  const storageRef = ref(storage, storagePath);
  const arrayBuffer = await audioBlob.arrayBuffer();
  await uploadBytes(storageRef, new Uint8Array(arrayBuffer), {
    contentType: 'audio/mpeg'
  });
  return getDownloadURL(storageRef);
};

export interface TrainingProgressSummary {
  totalPrograms: number;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export const getTrainingProgressSummary = async (
  roleSegment?: string
): Promise<TrainingProgressSummary> => {
  const programs = await fetchTrainingPrograms();
  const filteredPrograms = roleSegment
    ? programs.filter((program) => program.segment === roleSegment)
    : programs;

  const progressSnapshot = await getDocs(collection(db, PROGRESS_COLLECTION));
  const progressByProgram = new Map<string, number>();
  const statusAggregate = {
    completed: 0,
    inProgress: 0,
    notStarted: 0
  };

  progressSnapshot.forEach((docSnapshot) => {
    const data = docSnapshot.data() as DocumentData;
    const programId: string = data.programId;
    if (!programId) return;
    const progressPercent = data.progressPercent ?? 0;

    if (!progressByProgram.has(programId) || progressPercent > (progressByProgram.get(programId) ?? 0)) {
      progressByProgram.set(programId, progressPercent);
    }
  });

  for (const program of filteredPrograms) {
    const progressPercent = progressByProgram.get(program.id) ?? 0;
    if (progressPercent >= 100) {
      statusAggregate.completed += 1;
    } else if (progressPercent > 0) {
      statusAggregate.inProgress += 1;
    } else {
      statusAggregate.notStarted += 1;
    }
  }

  return {
    totalPrograms: filteredPrograms.length,
    ...statusAggregate
  };
};

export const subscribeToUserTrainingProgress = (
  userId: string,
  onChange: (progressMap: Record<string, TrainingProgress>) => void,
  onError?: (error: Error) => void
) => {
  const progressCollection = collection(db, PROGRESS_COLLECTION);
  const progressQuery = query(progressCollection, where('userId', '==', userId));

  return onSnapshot(
    progressQuery,
    (snapshot) => {
      const progressMap: Record<string, TrainingProgress> = {};
      snapshot.forEach((docSnapshot) => {
        const data = docSnapshot.data() as DocumentData;
        const progress: TrainingProgress = {
          id: docSnapshot.id,
          userId: data.userId,
          programId: data.programId,
          status: data.status ?? 'not_started',
          progressPercent: data.progressPercent ?? 0,
          lastAccessedAt: data.lastAccessedAt ? toIsoString(data.lastAccessedAt) : new Date().toISOString(),
          completedAt: data.completedAt ? toIsoString(data.completedAt) : undefined,
          llmModule: data.llmModule
            ? {
                script: data.llmModule.script,
                audioUrl: data.llmModule.audioUrl ?? null,
                generatedAt: data.llmModule.generatedAt ? toIsoString(data.llmModule.generatedAt) : new Date().toISOString()
              }
            : undefined
        };
        progressMap[progress.programId] = progress;
      });

      onChange(progressMap);
    },
    (error) => {
      logError('Failed to subscribe to training progress', { error: error.message, userId });
      if (onError) {
        onError(error);
      }
    }
  );
};
