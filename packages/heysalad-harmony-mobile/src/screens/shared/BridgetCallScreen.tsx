import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/colors';
import { ElevenLabsClient } from '../../services/voice/elevenLabsClient';

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

interface TranscriptEntry {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const BridgetCallScreen: React.FC = () => {
  const { user } = useAuth();

  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [pulseAnim] = useState(new Animated.Value(1));
  const [durationInterval, setDurationInterval] = useState<NodeJS.Timeout | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (callStatus === 'connected') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [callStatus, pulseAnim]);

  useEffect(() => {
    return () => {
      if (durationInterval) {
        clearInterval(durationInterval);
      }
    };
  }, [durationInterval]);

  const appendTranscript = (entry: TranscriptEntry) => {
    setTranscript((prev) => [...prev, entry]);
  };

  const sendMessageInternal = async (text: string, explicitConversationId?: string) => {
    const activeConversationId = explicitConversationId ?? conversationId;
    if (!activeConversationId) {
      throw new Error('Conversation not started');
    }

    const userEntry: TranscriptEntry = {
      id: `${Date.now()}-user`,
      text,
      isUser: true,
      timestamp: new Date(),
    };
    appendTranscript(userEntry);

    setIsSending(true);
    try {
      const result = await ElevenLabsClient.sendMessage(activeConversationId, text);
      const agentText =
        result.responseText ||
        "I'm processing your request. Let me know if you'd like me to try again.";

      const agentEntry: TranscriptEntry = {
        id: `${Date.now()}-agent`,
        text: agentText,
        isUser: false,
        timestamp: new Date(),
      };
      appendTranscript(agentEntry);
    } catch (error) {
      console.error('Message send failed:', error);
      appendTranscript({
        id: `${Date.now()}-error`,
        text: 'Sorry, I could not process that request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleStartCall = async () => {
    try {
      setCallStatus('connecting');
      setTranscript([]);
      setDuration(0);
      setMessageDraft('');

      const session = await ElevenLabsClient.startConversation();
      setConversationId(session.conversationId);

      setCallStatus('connected');

      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
      setDurationInterval(interval);

      setIsSending(true);
      try {
        const result = await ElevenLabsClient.sendMessage(
          session.conversationId,
          `Please greet ${user?.displayName || 'the user'} and introduce how you can help with Bereit workforce management.`
        );

        const agentText =
          result.responseText ||
          `Hello ${user?.displayName || 'there'}! I’m Bridget, your Bereit assistant.`;

        appendTranscript({
          id: `${Date.now()}-agent`,
          text: agentText,
          isUser: false,
          timestamp: new Date(),
        });
      } catch (greetError) {
        console.error('Greeting failed', greetError);
        appendTranscript({
          id: `${Date.now()}-agent-fallback`,
          text: "Hi there! I'm Bridget. Ask me anything about your workforce.",
          isUser: false,
          timestamp: new Date(),
        });
      } finally {
        setIsSending(false);
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      setCallStatus('error');
      setConversationId(null);
      Alert.alert(
        'Connection Error',
        'Failed to connect to Bridget. Please check your network or API credentials.'
      );
    }
  };

  const handleEndCall = () => {
    if (durationInterval) {
      clearInterval(durationInterval);
      setDurationInterval(null);
    }
    setCallStatus('idle');
    setConversationId(null);
    setMessageDraft('');
    Alert.alert('Call Ended', `Call duration: ${formatDuration(duration)}`);
    setDuration(0);
  };

  const handleSendMessage = async () => {
    const trimmed = messageDraft.trim();
    if (!trimmed || isSending) {
      return;
    }
    setMessageDraft('');
    try {
      await sendMessageInternal(trimmed);
    } catch (error) {
      console.error(error);
      Alert.alert('Connection error', 'Unable to reach the voice assistant. Please reconnect.');
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const renderCallButton = () => {
    if (callStatus === 'idle' || callStatus === 'error') {
      return (
        <TouchableOpacity
          style={[styles.callButton, styles.callButtonStart]}
          onPress={handleStartCall}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={40} color={COLORS.white} />
        </TouchableOpacity>
      );
    }

    if (callStatus === 'connecting') {
      return (
        <View style={[styles.callButton, styles.callButtonConnecting]}>
          <ActivityIndicator size="large" color={COLORS.white} />
        </View>
      );
    }

    return (
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[styles.callButton, styles.callButtonEnd]}
          onPress={handleEndCall}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={40} color={COLORS.white} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Talk to Bridget</Text>
          <Text style={styles.subtitle}>Your AI Workforce Companion</Text>
        </View>

        <View style={styles.avatarSection}>
          <View
            style={[
              styles.avatarContainer,
              callStatus === 'connected' && styles.avatarContainerActive,
            ]}
          >
            <Ionicons
              name="person"
              size={80}
              color={callStatus === 'connected' ? COLORS.primary : COLORS.gray[400]}
            />
          </View>

          <View style={styles.statusContainer}>
            {callStatus === 'connecting' && (
              <Text style={styles.statusText}>Connecting...</Text>
            )}
            {callStatus === 'connected' && (
              <>
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>LIVE</Text>
                </View>
                <Text style={styles.durationText}>{formatDuration(duration)}</Text>
              </>
            )}
            {callStatus === 'idle' && (
              <Text style={styles.statusText}>Good {getTimeOfDay()}! Ready when you are.</Text>
            )}
            {callStatus === 'error' && (
              <Text style={styles.statusTextError}>
                Something went wrong. Please try again.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.callButtonWrapper}>{renderCallButton()}</View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conversation</Text>

          {transcript.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={48} color={COLORS.gray[300]} />
              <Text style={styles.emptyStateText}>
                Start a call to speak with Bridget. She can help with schedules, attendance, and
                Bereit workflows.
              </Text>
            </View>
          ) : (
            <View style={styles.transcriptContainer}>
              {transcript.map((entry) => (
                <View key={entry.id} style={styles.messageRow}>
                  <View
                    style={[
                      styles.messageBubble,
                      entry.isUser ? styles.messageUser : styles.messageBot,
                    ]}
                  >
                    <Text
                      style={[
                        styles.messageText,
                        entry.isUser ? styles.messageTextUser : styles.messageTextBot,
                      ]}
                    >
                      {entry.text}
                    </Text>
                  </View>
                  <Text style={styles.messageTimestamp}>
                    {entry.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {callStatus === 'connected' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ask Bridget</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                value={messageDraft}
                onChangeText={setMessageDraft}
                placeholder="Ask about schedules, policies, or get help..."
                placeholderTextColor={COLORS.gray[400]}
                editable={!isSending}
                returnKeyType="send"
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!messageDraft.trim() || isSending) && styles.sendButtonDisabled,
                ]}
                onPress={handleSendMessage}
                disabled={!messageDraft.trim() || isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Ionicons name="send" size={20} color={COLORS.white} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Try asking Bridget...</Text>
          <View style={styles.suggestionList}>
            {[
              'Give me a quick workforce summary for today',
              "What's my team's attendance today?",
              'Generate a safety briefing for the morning shift',
              'Help me prepare an offboarding checklist',
            ].map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={styles.suggestionChip}
                onPress={() => {
                  if (callStatus !== 'connected' || isSending) return;
                  sendMessageInternal(suggestion).catch((error) => {
                    console.error('Suggestion send failed', error);
                  });
                }}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={16} color={COLORS.primary} />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    padding: SPACING.lg,
    alignItems: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  subtitle: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  avatarSection: {
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  avatarContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  avatarContainerActive: {
    borderWidth: 3,
    borderColor: `${COLORS.primary}50`,
    backgroundColor: `${COLORS.primary}15`,
  },
  statusContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  statusTextError: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.error,
  },
  liveIndicator: {
    flexDirection: 'row',
    gap: SPACING.xs,
    alignItems: 'center',
    backgroundColor: `${COLORS.error}15`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 999,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  liveText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  durationText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  callButtonWrapper: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  callButton: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  callButtonStart: {
    backgroundColor: COLORS.success,
  },
  callButtonConnecting: {
    backgroundColor: COLORS.info,
  },
  callButtonEnd: {
    backgroundColor: COLORS.error,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  transcriptContainer: {
    gap: SPACING.md,
  },
  messageRow: {
    gap: SPACING.xs,
  },
  messageBubble: {
    borderRadius: 16,
    padding: SPACING.md,
  },
  messageUser: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
  },
  messageBot: {
    backgroundColor: COLORS.gray[100],
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
  },
  messageTextUser: {
    color: COLORS.white,
  },
  messageTextBot: {
    color: COLORS.text.primary,
  },
  messageTimestamp: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.gray[500],
    marginLeft: SPACING.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    textAlign: 'center',
    color: COLORS.text.secondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.md,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.md,
    color: COLORS.text.primary,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray[400],
  },
  suggestionList: {
    gap: SPACING.sm,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionText: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    flexShrink: 1,
  },
});

export default BridgetCallScreen;
