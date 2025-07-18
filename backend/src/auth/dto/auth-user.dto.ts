import { Transaction } from '@/transaction/entities/transaction.entity';
import { User } from '@/users/entities/user.entity';

export class AuthUserDTO {
  status?: string | number | null;
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    wallets?: { id: string; balance: number; transactions: Transaction[] }[];
    activated: boolean;
  } | null;
  error?: string | null;
  constructor(
    status: string | number | null,
    token?: string | null,
    user?: User | null,
    error: string | null = null,
  ) {
    this.status = status;
    if (!token || token === '') {
      this.token = '';
    } else {
      this.token = token;
    }
    this.error = error;
    if (!user) {
      this.user = null;
    } else {
      this.user = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user?.phone,
        activated: user.activated,
        wallets: user?.wallets?.map((wallet) => ({
          id: wallet.id,
          balance: wallet.balance,
          transactions: wallet.transactions,
        })),
      };
    }
  }
}
