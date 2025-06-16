export interface TransactionTypes {
  id: string;
  sender_wallet?: string;
  receiver_wallet?: string;
  status: string;
  type: string;
  amount: number;
}
