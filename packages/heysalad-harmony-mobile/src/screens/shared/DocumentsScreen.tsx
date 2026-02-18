import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../../constants/colors';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../services/firebase/config';
import { Document } from '../../types/user';
import { format } from 'date-fns';

const DocumentsScreen: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'documents'),
        where('userId', '==', user.uid),
        orderBy('uploadedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const docsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt.toDate(),
      })) as Document[];

      setDocuments(docsData);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'contract':
        return 'document-text';
      case 'payslip':
        return 'receipt';
      case 'certificate':
        return 'ribbon';
      case 'visa':
        return 'card';
      default:
        return 'document';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const downloadDocument = async (doc: Document) => {
    try {
      setDownloadingId(doc.id);

      const storageRef = ref(storage, doc.fileUrl);
      const downloadUrl = await getDownloadURL(storageRef);

      const fileName = doc.title.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
      // @ts-ignore - documentDirectory exists at runtime in expo-file-system
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      const downloadResult = await FileSystem.downloadAsync(downloadUrl, fileUri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(downloadResult.uri);
      } else {
        Alert.alert('Success', 'Document downloaded successfully');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      Alert.alert('Error', 'Failed to download document');
    } finally {
      setDownloadingId(null);
    }
  };

  const renderDocument = ({ item }: { item: Document }) => (
    <TouchableOpacity
      style={styles.documentCard}
      onPress={() => downloadDocument(item)}
      disabled={downloadingId === item.id}
    >
      <View style={styles.documentIcon}>
        <Ionicons
          name={getDocumentIcon(item.type)}
          size={24}
          color={COLORS.primary}
        />
      </View>

      <View style={styles.documentInfo}>
        <Text style={styles.documentTitle}>{item.title}</Text>
        <Text style={styles.documentMeta}>
          {format(item.uploadedAt, 'MMM dd, yyyy')} • {formatFileSize(item.size)}
        </Text>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
        </View>
      </View>

      {downloadingId === item.id ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Ionicons name="download-outline" size={24} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {documents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={64} color={COLORS.gray[300]} />
          <Text style={styles.emptyText}>No documents yet</Text>
          <Text style={styles.emptySubtext}>
            Your documents will appear here when uploaded
          </Text>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={renderDocument}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.md,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  documentIcon: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  documentMeta: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  typeText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.text.secondary,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
  },
  emptySubtext: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
});

export default DocumentsScreen;