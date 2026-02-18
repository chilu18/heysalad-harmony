export type Role = 'HR Manager' | 'Operations Manager' | 'Warehouse Staff';

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
  id: string;
  email: string;
  name: string;
  roles: Role[];
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
}

export interface PackageTypeOption {
  type: PackageType;
  title: string;
  description: string;
  icon: string;
  available: boolean;
}