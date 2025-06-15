import { TransactionTypes } from "./Transaction";

export interface WalletTypes {
  id: string;
  balance: number;
  enabled: boolean;
  Transactions: TransactionTypes[];
}
