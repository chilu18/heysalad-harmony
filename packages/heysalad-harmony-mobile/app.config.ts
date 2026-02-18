import type { ConfigContext, ExpoConfig } from 'expo/config';
import 'dotenv/config';

const getEnv = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;
  return typeof value === 'string' ? value : undefined;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const extra = config.extra ?? {};

  return {
    ...config,
    name: 'Bereit',
    slug: 'bereit-mobile',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    jsEngine: 'jsc',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#06B6D4',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.agriweiss.bereitmobile',
      buildNumber: '1',
      supportsTablet: true,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription:
          "Bereit needs your location to verify you're at the warehouse when clocking in and out.",
        NSLocationAlwaysAndWhenInUseUsageDescription:
          'Bereit uses your location to track where you clock in and out for accurate time tracking.',
      },
    },
    android: {
      package: 'com.agriweiss.bereitmobile',
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#06B6D4',
      },
      permissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
    },
    plugins: [
      'expo-dev-client',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Bereit uses your location to track where you clock in and out for accurate time tracking.',
        },
      ],
    ],
    extra: {
      ...extra,
      eas: {
        projectId: 'bd018ce2-a5bb-4740-bd8c-12c716fa4244',
      },
      firebaseApiKey: getEnv('EXPO_PUBLIC_FIREBASE_API_KEY'),
      firebaseAuthDomain: getEnv('EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN'),
      firebaseProjectId: getEnv('EXPO_PUBLIC_FIREBASE_PROJECT_ID'),
      firebaseStorageBucket: getEnv('EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET'),
      firebaseMessagingSenderId: getEnv('EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
      firebaseAppId: getEnv('EXPO_PUBLIC_FIREBASE_APP_ID'),
      openAiApiKey: getEnv('EXPO_PUBLIC_OPENAI_API_KEY'),
      huggingFaceApiKey: getEnv('EXPO_PUBLIC_HUGGINGFACE_API_KEY'),
      huggingFaceModel: getEnv('EXPO_PUBLIC_HUGGINGFACE_MODEL'),
      elevenLabsApiKey: getEnv('EXPO_PUBLIC_ELEVENLABS_API_KEY'),
      elevenLabsAgentId: getEnv('EXPO_PUBLIC_ELEVENLABS_AGENT_ID'),
      elevenLabsVoiceId: getEnv('EXPO_PUBLIC_ELEVENLABS_VOICE_ID'),
      mapboxAccessToken: getEnv('EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN'),
    },
  };
};
