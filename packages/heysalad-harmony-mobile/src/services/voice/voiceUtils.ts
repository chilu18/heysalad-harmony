// src/services/voice/voiceUtils.ts

/**
 * Format duration in seconds to MM:SS or HH:MM:SS
 */
export const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
  
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };
  
  /**
   * Format call time to readable format
   */
  export const formatCallTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };
  
  /**
   * Get time of day greeting
   */
  export const getTimeOfDayGreeting = (): string => {
    const hour = new Date().getHours();
    
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  /**
   * Calculate call cost (based on Eleven Labs pricing)
   */
  export const calculateCallCost = (durationSeconds: number, charactersPerSecond: number = 150): number => {
    const totalCharacters = durationSeconds * charactersPerSecond;
    const costPerMillion = 30; // $30 per 1M characters (Creator tier)
    return (totalCharacters / 1000000) * costPerMillion;
  };
  
  /**
   * Voice message templates for common scenarios
   */
  export const VoiceMessages = {
    // Clock In/Out
    clockInSuccess: (location: string, time: string) => 
      `Good morning! You're clocked in at ${location}, ${time}. Have a productive shift!`,
    
    clockOutSuccess: (time: string, hours: number) => 
      `Clocked out successfully at ${time}. You worked ${hours} hours today. Well done!`,
    
    // Location
    locationError: (distance: number) => 
      `You're ${distance} meters from the warehouse. Please move to the clock-in area to proceed.`,
    
    // Shifts
    shiftReminder: (time: string) => 
      `Reminder: Your shift starts in 30 minutes at ${time}. See you soon!`,
    
    shiftUpdate: () => 
      `Your schedule has been updated. Please check your shifts tab for details.`,
    
    // Wellbeing
    wellbeingCheck: (name: string) => 
      `Hi ${name}, how are you feeling today? I'm here if you need to chat.`,
    
    burnoutWarning: () => 
      `I noticed you've worked 6 days straight. Are you managing okay?`,
    
    // Milestones
    milestone30Days: () => 
      `Congratulations on 30 days with Bereit! How has your experience been so far?`,
    
    milestone90Days: () => 
      `You've been with us 90 days now. You're doing brilliantly!`,
    
    // Safety
    safetyAlert: (message: string) => 
      `Safety alert: ${message}. Please review immediately.`,
    
    // Approvals
    approvalPending: (count: number) => 
      `You have ${count} pending ${count === 1 ? 'approval' : 'approvals'} requiring your attention.`,
    
    // General
    welcome: (name: string) => 
      `Welcome back, ${name}. How can I assist you today?`,
    
    goodbye: () => 
      `Have a great day! I'm here whenever you need me.`,
  };