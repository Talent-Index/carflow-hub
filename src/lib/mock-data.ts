import { User, Vehicle, Branch, ServiceSession, WashSession, LoyaltyWallet, OperatorReward } from '@/types';

export const mockUsers: User[] = [
  { id: 'owner-1', name: 'Alex Thompson', email: 'alex@autox402.com', role: 'owner', walletAddress: '0x1234...abcd' },
  { id: 'manager-1', name: 'Sarah Chen', email: 'sarah@autox402.com', role: 'manager', walletAddress: '0x5678...efgh' },
  { id: 'operator-1', name: 'Mike Rodriguez', email: 'mike@autox402.com', role: 'operator', walletAddress: '0x9abc...ijkl' },
  { id: 'operator-2', name: 'Emma Wilson', email: 'emma@autox402.com', role: 'operator', walletAddress: '0xdef0...mnop' },
  { id: 'customer-1', name: 'James Parker', email: 'james@email.com', role: 'customer', walletAddress: '0x1111...qrst' },
  { id: 'customer-2', name: 'Lisa Anderson', email: 'lisa@email.com', role: 'customer', walletAddress: '0x2222...uvwx' },
];

export const mockVehicles: Vehicle[] = [
  { id: 'v-1', customerId: 'customer-1', make: 'Tesla', model: 'Model 3', year: 2023, licensePlate: 'AVAX-001', color: 'Midnight Black' },
  { id: 'v-2', customerId: 'customer-1', make: 'BMW', model: 'M4', year: 2022, licensePlate: 'AVAX-002', color: 'Alpine White' },
  { id: 'v-3', customerId: 'customer-2', make: 'Mercedes', model: 'C-Class', year: 2023, licensePlate: 'AVAX-003', color: 'Obsidian Black' },
];

export const mockBranches: Branch[] = [
  { id: 'b-1', name: 'AutoX402 Downtown', address: '123 Main St, Crypto City', ownerId: 'owner-1', managerId: 'manager-1', type: 'both' },
  { id: 'b-2', name: 'AutoX402 Express Wash', address: '456 Oak Ave, Blockchain Valley', ownerId: 'owner-1', type: 'carwash' },
  { id: 'b-3', name: 'AutoX402 Service Center', address: '789 Tech Blvd, DeFi District', ownerId: 'owner-1', type: 'garage' },
];

export const mockServiceSessions: ServiceSession[] = [
  { id: 'ss-1', vehicleId: 'v-1', branchId: 'b-1', operatorId: 'operator-1', type: 'oil_change', description: 'Full synthetic oil change', status: 'completed', priceUSDC: 89.99, paymentStatus: 'paid', txHash: '0xabc123...', createdAt: new Date('2024-01-15'), completedAt: new Date('2024-01-15') },
  { id: 'ss-2', vehicleId: 'v-2', branchId: 'b-3', operatorId: 'operator-2', type: 'brake_service', description: 'Front brake pad replacement', status: 'in_progress', priceUSDC: 249.99, paymentStatus: 'unpaid', createdAt: new Date('2024-01-20') },
  { id: 'ss-3', vehicleId: 'v-3', branchId: 'b-1', operatorId: 'operator-1', type: 'inspection', description: 'Annual vehicle inspection', status: 'pending', priceUSDC: 49.99, paymentStatus: 'unpaid', createdAt: new Date('2024-01-22') },
];

export const mockWashSessions: WashSession[] = [
  { id: 'ws-1', vehicleId: 'v-1', branchId: 'b-1', operatorId: 'operator-1', type: 'premium', status: 'completed', priceUSDC: 34.99, paymentStatus: 'paid', txHash: '0xdef456...', createdAt: new Date('2024-01-18'), completedAt: new Date('2024-01-18') },
  { id: 'ws-2', vehicleId: 'v-2', branchId: 'b-2', operatorId: 'operator-2', type: 'deluxe', status: 'completed', priceUSDC: 49.99, paymentStatus: 'paid', txHash: '0xghi789...', createdAt: new Date('2024-01-19'), completedAt: new Date('2024-01-19') },
  { id: 'ws-3', vehicleId: 'v-3', branchId: 'b-1', operatorId: 'operator-1', type: 'basic', status: 'in_progress', priceUSDC: 14.99, paymentStatus: 'pending', createdAt: new Date('2024-01-22') },
];

export const mockLoyaltyWallets: LoyaltyWallet[] = [
  { id: 'lw-1', customerId: 'customer-1', points: 2450, tier: 'gold', totalSpentUSDC: 489.95 },
  { id: 'lw-2', customerId: 'customer-2', points: 850, tier: 'silver', totalSpentUSDC: 149.97 },
];

export const mockOperatorRewards: OperatorReward[] = [
  { id: 'or-1', operatorId: 'operator-1', earnedUSDC: 1250.50, pendingUSDC: 125.00, paidUSDC: 1125.50 },
  { id: 'or-2', operatorId: 'operator-2', earnedUSDC: 890.25, pendingUSDC: 89.99, paidUSDC: 800.26 },
];

export const washPrices = {
  basic: 14.99,
  standard: 24.99,
  premium: 34.99,
  deluxe: 49.99,
};

export const servicePrices = {
  oil_change: 89.99,
  tire_rotation: 39.99,
  brake_service: 249.99,
  inspection: 49.99,
  other: 0,
};
