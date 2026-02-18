import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase/config';
import { EquipmentCatalogService } from '../../services/training/equipmentCatalogService';
import { TRAINING_REQUIREMENTS, slugify } from '../../constants/beumerEquipment';
import LoadingScreen from './LoadingScreen';

interface EquipmentItemDoc {
  id: string;
  name: string;
  description?: string;
  trainingRequirementId?: string | null;
  ttsStatus?: string;
  audioUrl?: string;
}

interface EquipmentCategoryDoc {
  id: string;
  title: string;
  description?: string;
  items: EquipmentItemDoc[];
}

const statusCopy: Record<string, string> = {
  ready: 'Audio ready',
  pending: 'Audio pending',
  error: 'Audio generation failed',
};

const TrainingCatalogScreen: React.FC = () => {
  const { activeRole } = useAuth();
  const [catalog, setCatalog] = useState<EquipmentCategoryDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const canManage = activeRole === 'HR Manager' || activeRole === 'Operations Manager';

  const fetchCatalog = useCallback(async () => {
    const categorySnapshot = await getDocs(collection(db, 'equipmentCategories'));
    const categories: EquipmentCategoryDoc[] = [];

    for (const categoryDoc of categorySnapshot.docs) {
      const itemSnapshot = await getDocs(collection(categoryDoc.ref, 'items'));
      const items: EquipmentItemDoc[] = itemSnapshot.docs
        .map((docSnap) => {
          const data = docSnap.data() as Partial<EquipmentItemDoc>;
          return {
            id: docSnap.id,
            name: data.name ?? docSnap.id,
            description: data.description ?? '',
            trainingRequirementId: data.trainingRequirementId ?? null,
            ttsStatus: data.ttsStatus ?? 'pending',
            audioUrl: data.audioUrl,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      const categoryData = categoryDoc.data() as Partial<EquipmentCategoryDoc>;
      categories.push({
        id: categoryDoc.id,
        title: categoryData.title ?? categoryDoc.id,
        description: categoryData.description ?? '',
        items,
      });
    }

    categories.sort((a, b) => a.title.localeCompare(b.title));
    setCatalog(categories);
    return categories;
  }, []);

  useEffect(() => {
    const initialise = async () => {
      try {
        setLoading(true);
        const existing = await fetchCatalog();
        if (existing.length === 0) {
          await EquipmentCatalogService.syncBeumerCatalog();
          await fetchCatalog();
        }
      } catch (error) {
        console.error('Failed to load catalog', error);
        Alert.alert(
          'Training Catalog',
          'We could not load the equipment catalog. Pull to refresh or try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    initialise();
  }, [fetchCatalog]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchCatalog();
    } catch (error) {
      console.error('Refresh failed', error);
      Alert.alert('Refresh Failed', 'Unable to refresh the catalog right now.');
    } finally {
      setRefreshing(false);
    }
  }, [fetchCatalog]);

  const handleSyncCatalog = useCallback(async () => {
    try {
      setSyncing(true);
      await EquipmentCatalogService.syncBeumerCatalog();
      await fetchCatalog();
      Alert.alert('Catalog Updated', 'BEUMER equipment catalog has been refreshed.');
    } catch (error) {
      console.error('Catalog sync failed', error);
      Alert.alert('Sync Failed', 'Unable to sync the catalog. Please try again.');
    } finally {
      setSyncing(false);
    }
  }, [fetchCatalog]);

  const handleGenerateCategoryAudio = useCallback(
    async (categoryId: string) => {
      try {
        setProcessingId(categoryId);
        await EquipmentCatalogService.generateTtsForCategory(categoryId);
        await fetchCatalog();
        Alert.alert('Audio Ready', 'Voice assets generated for this category.');
      } catch (error) {
        console.error('Category audio generation failed', error);
        Alert.alert(
          'Audio Failed',
          'We were unable to generate audio for this category. Check credentials and try again.'
        );
      } finally {
        setProcessingId(null);
      }
    },
    [fetchCatalog]
  );

  const handleGenerateItemAudio = useCallback(
    async (categoryId: string, itemId: string) => {
      try {
        setProcessingId(`${categoryId}:${itemId}`);
        await EquipmentCatalogService.generateTtsForEquipment(categoryId, itemId);
        await fetchCatalog();
        Alert.alert('Audio Ready', 'Voice asset generated for this item.');
      } catch (error) {
        console.error('Item audio generation failed', error);
        Alert.alert(
          'Audio Failed',
          'We could not generate audio for this item. Verify your ElevenLabs configuration and try again.'
        );
      } finally {
        setProcessingId(null);
      }
    },
    [fetchCatalog]
  );

  const handleFeedback = useCallback((itemName: string) => {
    Alert.alert(
      'Feedback coming soon',
      `Thanks for exploring ${itemName}. Feedback submission will be available shortly.`
    );
  }, []);

  const trainingBySlug = useMemo(() => {
    return Object.fromEntries(TRAINING_REQUIREMENTS.map((req) => [slugify(req.equipmentCategory), req]));
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>BEUMER Training Catalog</Text>
          <Text style={styles.subheading}>
            Explore equipment modules and supporting voice assets.
          </Text>
        </View>
        {canManage && (
          <TouchableOpacity
            style={[styles.syncButton, syncing && styles.syncButtonDisabled]}
            onPress={handleSyncCatalog}
            disabled={syncing}
          >
            {syncing ? (
              <ActivityIndicator size="small" color={COLORS.white} />
            ) : (
              <Ionicons name="sync-outline" size={18} color={COLORS.white} />
            )}
            <Text style={styles.syncButtonLabel}>
              {syncing ? 'Syncing…' : 'Sync Catalog'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {catalog.map((category) => {
        const isCategoryProcessing = processingId === category.id;
        return (
          <View key={category.id} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                {category.description ? (
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                ) : null}
                <Text style={styles.categoryCount}>
                  {category.items.length} module{category.items.length === 1 ? '' : 's'}
                </Text>
              </View>
              {canManage && (
                <TouchableOpacity
                  style={styles.categoryAction}
                  onPress={() => handleGenerateCategoryAudio(category.id)}
                  disabled={isCategoryProcessing}
                >
                  {isCategoryProcessing ? (
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  ) : (
                    <Ionicons name="musical-notes-outline" size={22} color={COLORS.primary} />
                  )}
                  <Text style={styles.categoryActionLabel}>
                    {isCategoryProcessing ? 'Generating…' : 'Generate Audio'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.itemsContainer}>
              {category.items.map((item) => {
                const training = item.trainingRequirementId
                  ? trainingBySlug[item.trainingRequirementId]
                  : undefined;
                const itemProcessing = processingId === `${category.id}:${item.id}`;
                const status = item.ttsStatus ?? 'pending';
                const statusLabel = statusCopy[status] ?? 'Audio not generated';
                const statusColor =
                  status === 'ready'
                    ? COLORS.success
                    : status === 'error'
                    ? COLORS.error
                    : COLORS.text.secondary;

                return (
                  <View key={item.id} style={styles.itemCard}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemTitle}>{item.name}</Text>
                      <View style={styles.statusPill}>
                        <Ionicons
                          name={
                            status === 'ready'
                              ? 'musical-note'
                              : status === 'error'
                              ? 'alert-circle'
                              : 'hourglass-outline'
                          }
                          size={14}
                          color={statusColor}
                        />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                          {statusLabel}
                        </Text>
                      </View>
                    </View>

                    {training ? (
                      <View style={styles.trainingDetails}>
                        <Text style={styles.trainingDuration}>
                          Duration: {training.durationDays}
                        </Text>
                        <Text style={styles.trainingComponentsLabel}>Key Components:</Text>
                        {training.components.slice(0, 3).map((component) => (
                          <Text key={component} style={styles.trainingComponent}>
                            • {component}
                          </Text>
                        ))}
                        {training.components.length > 3 && (
                          <Text style={styles.trainingMore}>
                            + {training.components.length - 3} more topics
                          </Text>
                        )}
                        <Text style={styles.trainingCertsLabel}>Required Certifications:</Text>
                        <Text style={styles.trainingCerts}>
                          {training.certifications.join(', ')}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.trainingDetailsPlaceholder}>
                        Training outline to be defined by your Bereit team.
                      </Text>
                    )}

                    <View style={styles.itemActions}>
                      {canManage ? (
                        <TouchableOpacity
                          style={[
                            styles.generateButton,
                            itemProcessing && styles.generateButtonDisabled,
                          ]}
                          onPress={() => handleGenerateItemAudio(category.id, item.id)}
                          disabled={itemProcessing}
                        >
                          {itemProcessing ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                          ) : (
                            <Ionicons name="headset-outline" size={18} color={COLORS.white} />
                          )}
                          <Text style={styles.generateButtonLabel}>
                            {itemProcessing ? 'Generating…' : 'Generate Voice'}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={styles.feedbackButton}
                          onPress={() => handleFeedback(item.name)}
                        >
                          <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} />
                          <Text style={styles.feedbackLabel}>Send Feedback</Text>
                        </TouchableOpacity>
                      )}
                      {item.audioUrl && (
                        <View style={styles.audioHint}>
                          <Ionicons name="link-outline" size={16} color={COLORS.info} />
                          <Text style={styles.audioHintText}>Audio stored in Firebase</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.md,
  },
  header: {
    padding: SPACING.lg,
    gap: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  heading: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  subheading: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
  },
  syncButton: {
    marginTop: SPACING.sm,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  syncButtonDisabled: {
    opacity: 0.6,
  },
  syncButtonLabel: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  categoryCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  categoryTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text.primary,
  },
  categoryDescription: {
    marginTop: SPACING.xs,
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  categoryCount: {
    marginTop: SPACING.xs,
    color: COLORS.gray[500],
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  categoryAction: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  categoryActionLabel: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  itemCard: {
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: `${COLORS.border}`,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  itemTitle: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  trainingDetails: {
    gap: 4,
    marginBottom: SPACING.md,
  },
  trainingDuration: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  trainingComponentsLabel: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  trainingComponent: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
  },
  trainingMore: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.info,
  },
  trainingCertsLabel: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  trainingCerts: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
  },
  trainingDetailsPlaceholder: {
    color: COLORS.text.secondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginBottom: SPACING.md,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonLabel: {
    color: COLORS.white,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  feedbackLabel: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  audioHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  audioHintText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.info,
  },
});

export default TrainingCatalogScreen;
