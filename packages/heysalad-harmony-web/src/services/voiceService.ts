import { logError, logEvent } from './loggingService';

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const DEFAULT_VOICE_ID = import.meta.env.VITE_ELEVENLABS_VOICE_ID;
const DEFAULT_MODEL_ID = import.meta.env.VITE_ELEVENLABS_MODEL_ID ?? 'eleven_multilingual_v2';

export interface TextToSpeechOptions {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
}

const isConfigured = () => Boolean(API_KEY && (DEFAULT_VOICE_ID || import.meta.env.VITE_ELEVENLABS_VOICE_ID));

export const elevenLabsConfigured = isConfigured();

const requireConfiguration = () => {
  if (!API_KEY) {
    throw new Error('ElevenLabs API key is not configured. Set VITE_ELEVENLABS_API_KEY in your environment.');
  }
};

export const synthesizeSpeech = async (
  text: string,
  options: TextToSpeechOptions = {}
): Promise<Blob> => {
  requireConfiguration();

  const voiceId = options.voiceId ?? DEFAULT_VOICE_ID;
  if (!voiceId) {
    throw new Error('ElevenLabs voice ID is not configured. Set VITE_ELEVENLABS_VOICE_ID or pass voiceId explicitly.');
  }

  const modelId = options.modelId ?? DEFAULT_MODEL_ID;

  try {
    logEvent('info', 'Generating speech with ElevenLabs', {
      voiceId,
      modelId
    });

    const response = await fetch(`${ELEVEN_LABS_API_URL}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: modelId,
        voice_settings: {
          stability: options.stability ?? 0.4,
          similarity_boost: options.similarityBoost ?? 0.7,
          style: options.style ?? 0.5,
          use_speaker_boost: options.useSpeakerBoost ?? true
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ElevenLabs request failed with status ${response.status}: ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    logEvent('info', 'Successfully generated ElevenLabs audio');
    return new Blob([arrayBuffer], { type: 'audio/mpeg' });
  } catch (error: any) {
    logError('Failed to generate speech with ElevenLabs', {
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};
