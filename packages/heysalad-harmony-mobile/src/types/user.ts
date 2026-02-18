export type UserRole = 'HR Manager' | 'Operations Manager' | 'Warehouse Staff';

export type PackageType = 
  | 'onboarding'
  | 'visa'
  | 'pay'
  | 'bonus'
  | 'learning'
  | 'wellbeing';

export type VisaType = 
  | 'service-provider'
  | 'blue-card'
  | 'chancenkarte'
  | 'self-employed'
  | 'intra-company-transfer';

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: UserRole; // Keep for backward compatibility
  roles?: UserRole[]; // Add this - array of roles
  activeRole?: UserRole; // Add this - currently selected role
  firstName?: string;
  lastName?: string;
  department?: string;
  phoneNumber?: string;
  photoURL?: string;
  status?: 'active' | 'inactive' | 'pending';
  warehouseId?: string;
  biometricEnabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}


export interface PackageTypeOption {
  type: PackageType;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}

export interface Shift {
  id: string;
  userId: string;
  date: Date;
  startTime: string;
  endTime: string;
  position: string;
  warehouseId: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  clockIn: Date;
  clockOut?: Date;
  duration?: number;
  location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    address?: string;
    clockOutLocation?: {
      latitude: number;
      longitude: number;
    };
  };
  warehouseId: string;
  status: 'active' | 'completed';
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  handledAt?: Date;
}

export interface Document {
  id: string;
  userId: string;
  name: string;
  title: string;        // Add this
  type: string;
  url: string;
  fileUrl: string;      // Add this
  size: number;
  uploadedAt: Date;
  category?: string;
}
