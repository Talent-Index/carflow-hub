export type UserRole = 'owner' | 'manager' | 'operator' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  walletAddress?: string;
  avatarUrl?: string;
}

export interface Vehicle {
  id: string;
  customerId: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color: string;
  imageUrl?: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  ownerId: string;
  managerId?: string;
  type: 'garage' | 'carwash' | 'both';
}

export interface ServiceSession {
  id: string;
  vehicleId: string;
  branchId: string;
  operatorId: string;
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'inspection' | 'other';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priceUSDC: number;
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  txHash?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface WashSession {
  id: string;
  vehicleId: string;
  branchId: string;
  operatorId: string;
  type: 'basic' | 'standard' | 'premium' | 'deluxe';
  status: 'pending' | 'in_progress' | 'completed';
  priceUSDC: number;
  paymentStatus: 'unpaid' | 'pending' | 'paid';
  txHash?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface LoyaltyWallet {
  id: string;
  customerId: string;
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpentUSDC: number;
}

export interface OperatorReward {
  id: string;
  operatorId: string;
  earnedUSDC: number;
  pendingUSDC: number;
  paidUSDC: number;
}

export interface PaymentRequest {
  amount: number;
  asset: 'USDC' | 'AVAX';
  recipient: string;
  sessionId: string;
  sessionType: 'service' | 'wash';
}

export interface X402PaymentHeader {
  'X-Payment': string;
  'X-Payment-Signature': string;
}
