import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../services/firebase/config';
import { User, UserRole } from '../types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ACTIVE_ROLE_KEY = 'bereit_active_role';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  activeRole: UserRole | null;
  availableRoles: UserRole[];
  switchRole: (role: UserRole) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<UserRole | null>(null);
  const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);

  const toDate = (timestamp: any): Date => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return new Date();
  };

  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        
        // Handle both single role and multiple roles
        const userRoles: UserRole[] = data.roles 
          ? data.roles 
          : data.role 
          ? [data.role] 
          : ['Warehouse Staff'];

        setAvailableRoles(userRoles);

        // Get saved active role from AsyncStorage
        const savedRole = await AsyncStorage.getItem(ACTIVE_ROLE_KEY);
        const roleToUse = savedRole && userRoles.includes(savedRole as UserRole)
          ? (savedRole as UserRole)
          : userRoles[0];

        setActiveRole(roleToUse);

        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || data.displayName || data.name,
          role: roleToUse,
          roles: userRoles,
          activeRole: roleToUse,
          firstName: data.firstName,
          lastName: data.lastName,
          department: data.department,
          phoneNumber: data.phoneNumber,
          photoURL: firebaseUser.photoURL || data.photoURL,
          status: data.status,
          warehouseId: data.warehouseId,
          biometricEnabled: data.biometricEnabled,
          createdAt: toDate(data.createdAt),
          updatedAt: toDate(data.updatedAt),
          lastLogin: data.lastLogin ? toDate(data.lastLogin) : undefined,
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        setUser(userData);
      } else {
        setUser(null);
        setActiveRole(null);
        setAvailableRoles([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const switchRole = async (role: UserRole): Promise<void> => {
    if (!user || !availableRoles.includes(role)) {
      throw new Error('Invalid role selection');
    }

    setActiveRole(role);
    await AsyncStorage.setItem(ACTIVE_ROLE_KEY, role);

    // Update user object with new active role
    setUser({
      ...user,
      role,
      activeRole: role,
    });

    console.log(`✅ Switched to role: ${role}`);
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login
      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await updateDoc(userDocRef, {
        lastLogin: Timestamp.now(),
      });

      const userData = await fetchUserData(userCredential.user);
      setUser(userData);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth);
      await AsyncStorage.removeItem(ACTIVE_ROLE_KEY);
      setUser(null);
      setActiveRole(null);
      setAvailableRoles([]);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<User>
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const now = Timestamp.now();
      const userRole = userData.role || 'Warehouse Staff';
      const userRoles = userData.roles || [userRole];

      const newUser: User = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || '',
        displayName: userData.displayName,
        role: userRole,
        roles: userRoles,
        activeRole: userRole,
        firstName: userData.firstName,
        lastName: userData.lastName,
        department: userData.department,
        phoneNumber: userData.phoneNumber,
        photoURL: userData.photoURL,
        status: 'active',
        warehouseId: userData.warehouseId,
        biometricEnabled: userData.biometricEnabled,
        createdAt: now.toDate(),
        updatedAt: now.toDate(),
      };

      const userDocRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userDocRef, {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
        roles: newUser.roles,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        department: newUser.department,
        phoneNumber: newUser.phoneNumber,
        photoURL: newUser.photoURL,
        status: newUser.status,
        warehouseId: newUser.warehouseId,
        biometricEnabled: newUser.biometricEnabled,
        createdAt: now,
        updatedAt: now,
        lastLogin: now,
      });
      
      setUser(newUser);
      setActiveRole(userRole);
      setAvailableRoles(userRoles);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    activeRole,
    availableRoles,
    switchRole,
    signIn,
    signOut,
    signUp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};