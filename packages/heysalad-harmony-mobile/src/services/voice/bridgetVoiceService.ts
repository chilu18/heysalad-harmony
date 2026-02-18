// src/services/voice/bridgetVoiceService.ts
import Constants from 'expo-constants';
import { Audio } from 'expo-av';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';

const ELEVEN_LABS_API_KEY = Constants.expoConfig?.extra?.elevenLabsApiKey || process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
const AGENT_ID = Constants.expoConfig?.extra?.elevenLabsAgentId || process.env.EXPO_PUBLIC_ELEVENLABS_AGENT_ID;

export interface VoiceCallLog {
  userId: string;
  userName: string;
  userRole: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  conversationId?: string;
  status: 'active' | 'completed' | 'failed';
  messageCount?: number;
}

export interface VoiceCallMetrics {
  totalCalls: number;
  totalDuration: number; // in seconds
  averageDuration: number;
  callsToday: number;
  callsThisWeek: number;
}

class BridgetVoiceService {
  private websocket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private isConnected: boolean = false;
  private currentCallId: string | null = null;
  private callStartTime: Date | null = null;
  private messageCount: number = 0;

  // Callbacks
  private onCallStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void;
  private onDurationUpdate?: (seconds: number) => void;
  private onTranscript?: (text: string, isUser: boolean) => void;
  private durationInterval?: NodeJS.Timeout;

  constructor() {
    this.initializeAudio();
  }

  private async initializeAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  /**
   * Start a voice call with Bridget
   */
  async startCall(userId: string, userName: string, userRole: string): Promise<void> {
    try {
      this.onCallStatusChange?.('connecting');

      // Create call log in Firestore
      const callLogRef = await addDoc(collection(db, 'voiceCalls'), {
        userId,
        userName,
        userRole,
        startTime: new Date(),
        status: 'active',
        messageCount: 0,
      });

      this.currentCallId = callLogRef.id;
      this.callStartTime = new Date();
      this.messageCount = 0;

      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream;

      // Connect to Eleven Labs WebSocket
      await this.connectWebSocket();

      // Start duration counter
      this.startDurationCounter();

      this.onCallStatusChange?.('connected');
    } catch (error) {
      console.error('Failed to start call:', error);
      this.onCallStatusChange?.('error');
      throw error;
    }
  }

  /**
   * Connect to Eleven Labs WebSocket for real-time conversation
   */
  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${AGENT_ID}`;

      this.websocket = new WebSocket(wsUrl);

      this.websocket.onopen = () => {
        console.log('✅ Connected to Bridget');
        
        // Send signed URL request with API key
        if (this.websocket) {
          this.websocket.send(JSON.stringify({
            type: 'conversation_initiation_client_data',
            conversation_config_override: {
              agent: {
                prompt: {
                  prompt: 'You are Bridget, Bereit\'s supportive AI workforce companion.'
                }
              }
            },
            custom_llm_extra_body: {
              'xi-api-key': ELEVEN_LABS_API_KEY
            }
          }));
        }
        
        this.isConnected = true;
        resolve();
      };

      this.websocket.onmessage = (event) => {
        this.handleWebSocketMessage(event);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
        reject(error);
      };

      this.websocket.onclose = () => {
        console.log('❌ Disconnected from Bridget');
        this.isConnected = false;
      };
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleWebSocketMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);

      // Handle different message types
      switch (data.type) {
        case 'audio':
          this.playAudioChunk(data.audio);
          break;
        case 'transcript':
          this.onTranscript?.(data.text, data.is_user);
          this.messageCount++;
          break;
        case 'conversation_initiation_metadata':
          console.log('Conversation started:', data.conversation_id);
          break;
        case 'ping':
          // Respond to ping to keep connection alive
          if (this.websocket) {
            this.websocket.send(JSON.stringify({ type: 'pong' }));
          }
          break;
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  /**
   * Send audio data to WebSocket
   */
  private sendAudioData(audioData: ArrayBuffer) {
    if (this.websocket && this.isConnected) {
      this.websocket.send(audioData);
    }
  }

  /**
   * Play audio chunk received from Bridget
   */
  private async playAudioChunk(audioBase64: string) {
    try {
      // Convert base64 to audio and play
      const audioData = atob(audioBase64);
      const arrayBuffer = new Uint8Array(audioData.length);
      for (let i = 0; i < audioData.length; i++) {
        arrayBuffer[i] = audioData.charCodeAt(i);
      }

      // Play audio using expo-av
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/mp3;base64,${audioBase64}` },
        { shouldPlay: true }
      );

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }

  /**
   * Start counting call duration
   */
  private startDurationCounter() {
    this.durationInterval = setInterval(() => {
      if (this.callStartTime) {
        const seconds = Math.floor((Date.now() - this.callStartTime.getTime()) / 1000);
        this.onDurationUpdate?.(seconds);
      }
    }, 1000);
  }

  /**
   * End the voice call
   */
  async endCall(): Promise<void> {
    try {
      // Stop duration counter
      if (this.durationInterval) {
        clearInterval(this.durationInterval);
      }

      // Close WebSocket
      if (this.websocket) {
        this.websocket.close();
        this.websocket = null;
      }

      // Stop media stream
      if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
      }

      // Update call log in Firestore
      if (this.currentCallId && this.callStartTime) {
        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - this.callStartTime.getTime()) / 1000);

        await updateDoc(doc(db, 'voiceCalls', this.currentCallId), {
          endTime,
          duration,
          status: 'completed',
          messageCount: this.messageCount,
        });
      }

      this.isConnected = false;
      this.currentCallId = null;
      this.callStartTime = null;
      this.messageCount = 0;

      this.onCallStatusChange?.('disconnected');
    } catch (error) {
      console.error('Failed to end call:', error);
      throw error;
    }
  }

  /**
   * Set callback for call status changes
   */
  setCallStatusListener(callback: (status: 'connecting' | 'connected' | 'disconnected' | 'error') => void) {
    this.onCallStatusChange = callback;
  }

  /**
   * Set callback for duration updates
   */
  setDurationListener(callback: (seconds: number) => void) {
    this.onDurationUpdate = callback;
  }

  /**
   * Set callback for transcript updates
   */
  setTranscriptListener(callback: (text: string, isUser: boolean) => void) {
    this.onTranscript = callback;
  }

  /**
   * Check if currently in a call
   */
  isInCall(): boolean {
    return this.isConnected;
  }

  /**
   * Get current call duration in seconds
   */
  getCurrentDuration(): number {
    if (!this.callStartTime) return 0;
    return Math.floor((Date.now() - this.callStartTime.getTime()) / 1000);
  }
}

// Singleton instance
export const bridgetVoice = new BridgetVoiceService();