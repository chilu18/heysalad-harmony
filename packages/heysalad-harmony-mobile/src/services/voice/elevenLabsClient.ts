import Constants from 'expo-constants';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io';

const expoExtra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

const selectCredential = (...values: (string | undefined | null)[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
};

const API_KEY = selectCredential(
  process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY,
  expoExtra.elevenLabsApiKey as string | undefined
);
const AGENT_ID = selectCredential(
  process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID,
  expoExtra.elevenLabsAgentId as string | undefined
);
const VOICE_ID = selectCredential(
  process.env.EXPO_PUBLIC_ELEVENLABS_VOICE_ID,
  expoExtra.elevenLabsVoiceId as string | undefined
);

if (__DEV__) {
  if (!API_KEY) {
    console.warn('[ElevenLabs] Missing EXPO_PUBLIC_ELEVENLABS_API_KEY');
  }
  if (!AGENT_ID) {
    console.warn('[ElevenLabs] Missing EXPO_PUBLIC_ELEVENLABS_AGENT_ID');
  }
  if (!VOICE_ID) {
    console.warn('[ElevenLabs] Missing EXPO_PUBLIC_ELEVENLABS_VOICE_ID');
  }
}

export interface ElevenLabsConversation {
  conversationId: string;
}

export interface ElevenLabsMessageResult {
  responseText: string;
  audioFileUri?: string;
}

const headers = () => ({
  'Content-Type': 'application/json',
  'xi-api-key': API_KEY || '',
});

const ensureCredentials = () => {
  if (!API_KEY || !AGENT_ID || !VOICE_ID) {
    throw new Error('Missing ElevenLabs credentials. Please check your .env configuration.');
  }
};

const writeAudioToCache = async (audioBase64: string): Promise<string> => {
  const fileUri = `${FileSystem.cacheDirectory}voice-${Date.now()}.mp3`;
  await FileSystem.writeAsStringAsync(fileUri, audioBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return fileUri;
};

const playAudioFile = async (uri: string) => {
  const { sound } = await Audio.Sound.createAsync({ uri });
  sound.playAsync();
  sound.setOnPlaybackStatusUpdate((status) => {
    if (!status.isLoaded) return;
    if (status.didJustFinish) {
      sound.unloadAsync().catch(() => {});
    }
  });
};

const buildErrorMessage = async (response: Response, action: string) => {
  let detail: string;
  try {
    const text = await response.text();
    detail = text || 'No response body returned';
  } catch {
    detail = 'Unable to read error body';
  }

  const hint =
    response.status === 401
      ? 'Verify your EXPO_PUBLIC_ELEVENLABS_API_KEY.'
      : response.status === 404
      ? 'Verify the EXPO_PUBLIC_ELEVENLABS_AGENT_ID (and voice if overridden).'
      : undefined;

  return `Failed to ${action} (status ${response.status}): ${detail}${
    hint ? ` Hint: ${hint}` : ''
  }`;
};

export const ElevenLabsClient = {
  startConversation: async (): Promise<ElevenLabsConversation> => {
    ensureCredentials();

    const response = await fetch(`${ELEVENLABS_BASE_URL}/v1/convai/conversation`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(
        VOICE_ID
          ? {
              agent_id: AGENT_ID,
              voice_settings: {
                voice_id: VOICE_ID,
              },
            }
          : {
              agent_id: AGENT_ID,
            }
      ),
    });

    if (!response.ok) {
      throw new Error(await buildErrorMessage(response, 'create conversation'));
    }

    const data = await response.json();
    const conversationId =
      data?.conversation_id ||
      data?.conversation?.conversation_id ||
      data?.id;

    if (!conversationId) {
      throw new Error('Failed to parse conversation response from ElevenLabs.');
    }

    return {
      conversationId,
    };
  },

  sendMessage: async (
    conversationId: string,
    text: string
  ): Promise<ElevenLabsMessageResult> => {
    ensureCredentials();

    const response = await fetch(
      `${ELEVENLABS_BASE_URL}/v1/convai/conversation/${conversationId}/message`,
      {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          text,
          agent_id: AGENT_ID,
          ...(VOICE_ID
            ? {
                voice_settings: {
                  voice_id: VOICE_ID,
                },
              }
            : {}),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(await buildErrorMessage(response, 'send message'));
    }

    const data = await response.json();
    const agentReply =
      data?.reply ||
      data?.response ||
      data?.message ||
      data;

    let audioUri: string | undefined;

    const audioBase64 =
      agentReply?.audio?.base64 ||
      agentReply?.audio?.[0]?.audio_base64 ||
      agentReply?.output?.find((item: any) => item?.content_type === 'audio')?.audio
        ?.audio_base64 ||
      agentReply?.output_audio?.audio_base64;

    if (audioBase64) {
      audioUri = await writeAudioToCache(audioBase64);
      await playAudioFile(audioUri);
    }

    const responseText =
      agentReply?.text ||
      agentReply?.response ||
      agentReply?.output_text ||
      agentReply?.transcript ||
      '';

    return {
      responseText,
      audioFileUri: audioUri,
    };
  },
};
