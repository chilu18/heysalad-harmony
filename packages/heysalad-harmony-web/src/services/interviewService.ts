import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Interview {
  id?: string;
  candidateName: string;
  candidateEmail: string;
  candidateId?: string;
  interviewerId: string;
  interviewerName: string;
  position: string;
  location: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  meetingLink?: string;
  notes?: string;
  rating?: number;
  outcome?: 'hired' | 'rejected' | 'pending' | 'second-round';
}

export const interviewService = {
  async create(interview: Interview) {
    try {
      const docRef = await addDoc(collection(db, 'interviews'), {
        ...interview,
        scheduledAt: Timestamp.fromDate(interview.scheduledAt),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Create interview error:', error);
      return { success: false, error: error.message };
    }
  },

  async update(interviewId: string, updates: Partial<Interview>) {
    try {
      await updateDoc(doc(db, 'interviews', interviewId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('Update interview error:', error);
      return { success: false, error: error.message };
    }
  },

  async cancel(interviewId: string) {
    try {
      await updateDoc(doc(db, 'interviews', interviewId), {
        status: 'cancelled',
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('Cancel interview error:', error);
      return { success: false, error: error.message };
    }
  },

  async getForUser(userId: string, role: 'interviewer' | 'candidate') {
    try {
      const field = role === 'interviewer' ? 'interviewerId' : 'candidateId';
      const q = query(collection(db, 'interviews'), where(field, '==', userId));
      const snapshot = await getDocs(q);
      const interviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: interviews };
    } catch (error: any) {
      console.error('Get interviews error:', error);
      return { success: false, error: error.message };
    }
  },
};