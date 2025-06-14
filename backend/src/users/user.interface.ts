import { Wallet } from '@/wallet/entities/wallet.entity';

export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  wallet: Wallet;
}
