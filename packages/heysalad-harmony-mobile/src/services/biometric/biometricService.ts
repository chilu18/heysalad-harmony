import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';

export interface BiometricCapabilities {
  isAvailable: boolean;
  biometricType: 'fingerprint' | 'facial' | 'iris' | 'none';
  isEnrolled: boolean;
}

class BiometricService {
  async checkBiometricCapabilities(): Promise<BiometricCapabilities> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    let biometricType: 'fingerprint' | 'facial' | 'iris' | 'none' = 'none';
    
    if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      biometricType = 'facial';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      biometricType = 'fingerprint';
    } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      biometricType = 'iris';
    }

    return {
      isAvailable: hasHardware && isEnrolled,
      biometricType,
      isEnrolled,
    };
  }

  async authenticate(reason?: string): Promise<boolean> {
    const defaultReason = Platform.select({
      ios: 'Authenticate to access bereit',
      android: 'Use biometric authentication',
      default: 'Authenticate',
    });

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: reason || defaultReason,
      fallbackLabel: 'Use passcode',
      disableDeviceFallback: false,
    });

    return result.success;
  }

  async enableBiometric(userId: string, email: string): Promise<boolean> {
    try {
      const capabilities = await this.checkBiometricCapabilities();
      
      if (!capabilities.isAvailable) {
        throw new Error('Biometric authentication is not available on this device');
      }

      const isAuthenticated = await this.authenticate('Enable biometric login');
      
      if (isAuthenticated) {
        await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
        await SecureStore.setItemAsync(
          BIOMETRIC_CREDENTIALS_KEY,
          JSON.stringify({ userId, email })
        );
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      throw error;
    }
  }

  async disableBiometric(): Promise<void> {
    await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
    await SecureStore.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY);
  }

  async isBiometricEnabled(): Promise<boolean> {
    const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
    return enabled === 'true';
  }

  async getSavedCredentials(): Promise<{ userId: string; email: string } | null> {
    const credentials = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);
    return credentials ? JSON.parse(credentials) : null;
  }

  getBiometricTypeLabel(type: string): string {
    switch (type) {
      case 'facial':
        return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
      case 'fingerprint':
        return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
      case 'iris':
        return 'Iris Recognition';
      default:
        return 'Biometric';
    }
  }
}

export default new BiometricService();