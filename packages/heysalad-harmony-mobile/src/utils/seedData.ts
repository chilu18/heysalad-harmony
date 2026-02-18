// src/utils/seedData.ts
import { collection, addDoc, Timestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase/config';

export const seedFirebaseData = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Sample user IDs (these should be existing users in your Firebase Auth)
    const sampleUsers = [
      { id: 'user1', name: 'John Smith', email: 'john.warehouse@bereit.works' },
      { id: 'user2', name: 'Emma Wilson', email: 'emma.warehouse@bereit.works' },
      { id: 'user3', name: 'David Brown', email: 'david.warehouse@bereit.works' },
    ];

    // Create shifts for the next 7 days
    console.log('\n📅 Creating shifts...');
    const shiftsCreated = [];
    
    for (const user of sampleUsers) {
      for (let i = 0; i < 7; i++) {
        const shiftDate = new Date();
        shiftDate.setDate(shiftDate.getDate() + i);
        
        const startTime = new Date(shiftDate);
        startTime.setHours(9, 0, 0, 0);
        
        const endTime = new Date(shiftDate);
        endTime.setHours(17, 0, 0, 0);

        const shift = {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          startTime: Timestamp.fromDate(startTime),
          endTime: Timestamp.fromDate(endTime),
          location: 'London Distribution Center',
          status: i < 0 ? 'completed' : 'scheduled', // Past shifts are completed
          createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'shifts'), shift);
        shiftsCreated.push(docRef.id);
      }
    }
    
    console.log(`✅ Created ${shiftsCreated.length} shifts`);

    // Create time entries for the past 7 days
    console.log('\n⏰ Creating time entries...');
    const timeEntriesCreated = [];
    
    for (const user of sampleUsers) {
      for (let i = 1; i <= 7; i++) {
        const entryDate = new Date();
        entryDate.setDate(entryDate.getDate() - i);
        
        const clockIn = new Date(entryDate);
        clockIn.setHours(8, 45 + Math.floor(Math.random() * 30), 0, 0); // Random clock in between 8:45-9:15
        
        const clockOut = new Date(entryDate);
        clockOut.setHours(17, Math.floor(Math.random() * 30), 0, 0); // Random clock out between 17:00-17:30

        const timeEntry = {
          userId: user.id,
          userName: user.name,
          userRole: 'Warehouse Staff',
          clockIn: Timestamp.fromDate(clockIn),
          clockOut: Timestamp.fromDate(clockOut),
          clockInLocation: {
            latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
            longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
          },
          clockOutLocation: {
            latitude: 51.5074 + (Math.random() - 0.5) * 0.01,
            longitude: -0.1278 + (Math.random() - 0.5) * 0.01,
          },
          status: 'completed',
          createdAt: Timestamp.now(),
        };

        const docRef = await addDoc(collection(db, 'timeEntries'), timeEntry);
        timeEntriesCreated.push(docRef.id);
      }
    }
    
    console.log(`✅ Created ${timeEntriesCreated.length} time entries`);

    // Check if users exist in Firestore users collection, if not add them
    console.log('\n👥 Checking users collection...');
    let usersAdded = 0;
    
    for (const user of sampleUsers) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', user.email));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        await addDoc(collection(db, 'users'), {
          id: user.id,
          name: user.name,
          email: user.email,
          roles: ['Warehouse Staff'],
          status: 'active',
          createdAt: Timestamp.now(),
        });
        usersAdded++;
        console.log(`✅ Added user: ${user.name}`);
      } else {
        console.log(`⚠️  User ${user.email} already exists in Firestore`);
      }
    }
    
    if (usersAdded > 0) {
      console.log(`✅ Added ${usersAdded} users to Firestore`);
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Shifts: ${shiftsCreated.length}`);
    console.log(`   - Time Entries: ${timeEntriesCreated.length}`);
    console.log(`   - Users: ${usersAdded} new`);

    return {
      success: true,
      data: {
        shifts: shiftsCreated.length,
        timeEntries: timeEntriesCreated.length,
        users: usersAdded,
      },
    };

  } catch (error: any) {
    console.error('❌ Seeding error:', error);
    return {
      success: false,
      error: error.message || 'Failed to seed data',
    };
  }
};