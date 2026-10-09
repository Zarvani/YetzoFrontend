export interface Wallet {
  id: string;
  user: string;
  balance: number;
  currency: string;
  is_active: boolean;
}

export interface WalletTransaction {
  id: string;
  wallet: string;
  amount: number;
  transaction_type: "credit" | "debit";
  description: string;
  reference_id?: string;
  created_at: string;
}
