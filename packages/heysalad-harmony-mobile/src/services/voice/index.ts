// src/services/voice/index.ts

// Main service
export { bridgetVoice } from './bridgetVoiceService';

// Utility functions
export { 
  formatDuration, 
  formatCallTime,
  getTimeOfDayGreeting,
  calculateCallCost,
  VoiceMessages 
} from './voiceUtils';

// Types
export type { 
  VoiceCallLog, 
  VoiceCallMetrics 
} from './bridgetVoiceService';