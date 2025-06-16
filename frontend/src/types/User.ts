import { WalletTypes } from "./Wallet";

export interface UserTypes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  totalBalance?: number;
  wallets: WalletTypes[];
}
