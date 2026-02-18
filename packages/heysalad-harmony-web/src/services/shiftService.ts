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

export interface Shift {
  id?: string;
  userId: string;
  location: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  type: 'morning' | 'afternoon' | 'night' | 'split';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  role: string;
  supervisor: string;
  notes?: string;
  checkIn?: Date;
  checkOut?: Date;
}

export const shiftService = {
  // Create shift
  async create(shift: Shift) {
    try {
      const docRef = await addDoc(collection(db, 'shifts'), {
        ...shift,
        date: Timestamp.fromDate(shift.date),
        startTime: Timestamp.fromDate(shift.startTime),
        endTime: Timestamp.fromDate(shift.endTime),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return { success: true, id: docRef.id };
    } catch (error: any) {
      console.error('Create shift error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check in
  async checkIn(shiftId: string) {
    try {
      await updateDoc(doc(db, 'shifts', shiftId), {
        checkIn: serverTimestamp(),
        status: 'confirmed',
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('Check in error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check out
  async checkOut(shiftId: string) {
    try {
      await updateDoc(doc(db, 'shifts', shiftId), {
        checkOut: serverTimestamp(),
        status: 'completed',
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error: any) {
      console.error('Check out error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get shifts for user
  async getForUser(userId: string, startDate?: Date, endDate?: Date) {
    try {
      let q = query(collection(db, 'shifts'), where('userId', '==', userId));
      
      if (startDate) {
        q = query(q, where('date', '>=', Timestamp.fromDate(startDate)));
      }
      if (endDate) {
        q = query(q, where('date', '<=', Timestamp.fromDate(endDate)));
      }
      
      const snapshot = await getDocs(q);
      const shifts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: shifts };
    } catch (error: any) {
      console.error('Get shifts error:', error);
      return { success: false, error: error.message };
    }
  },
};