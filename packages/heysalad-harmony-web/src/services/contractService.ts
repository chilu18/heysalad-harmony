import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../config/firebase';

export interface Contract {
  id?: string;
  userId: string;
  packageId: string;
  type: 'Arbeitsvertrag' | 'Datenschutz' | 'NDA';
  documentUrl: string;
  status: 'pending' | 'sent' | 'viewed' | 'signed' | 'expired';
  sentAt?: Date;
  viewedAt?: Date;
  signedAt?: Date;
  signatureData?: string;
  ipAddress?: string;
  expiresAt: Date;
  createdBy: string;
}

export const contractService = {
  // Create contract
  async create(contract: Omit<Contract, 'id'>) {
    try {
      const docRef = await addDoc(collection(db, 'contracts'), {
        ...contract,
        expiresAt: Timestamp.fromDate(contract.expiresAt),
        createdAt: serverTimestamp(),
        status: 'pending',
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Create contract error:', error);
      return { success: false, error: error.message };
    }
  },

  // Mark as viewed
  async markViewed(contractId: string) {
    try {
      await updateDoc(doc(db, 'contracts', contractId), {
        status: 'viewed',
        viewedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('Mark viewed error:', error);
      return { success: false, error: error.message };
    }
  },

  // Sign contract
  async sign(contractId: string, signatureBlob: Blob, ipAddress: string) {
    try {
      // Upload signature to storage
      const signatureRef = ref(storage, `signatures/${contractId}/signature.png`);
      await uploadBytes(signatureRef, signatureBlob);
      const signatureUrl = await getDownloadURL(signatureRef);

      // Update contract
      await updateDoc(doc(db, 'contracts', contractId), {
        status: 'signed',
        signedAt: serverTimestamp(),
        signatureData: signatureUrl,
        ipAddress: ipAddress,
      });

      return { success: true };
    } catch (error: any) {
      console.error('Sign contract error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get contract
  async get(contractId: string) {
    try {
      const contractDoc = await getDoc(doc(db, 'contracts', contractId));
      if (contractDoc.exists()) {
        return { success: true, data: { id: contractDoc.id, ...contractDoc.data() } };
      }
      return { success: false, error: 'Contract not found' };
    } catch (error: any) {
      console.error('Get contract error:', error);
      return { success: false, error: error.message };
    }
  },
};