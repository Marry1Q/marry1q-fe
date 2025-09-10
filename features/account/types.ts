export type TransactionType = "deposit" | "withdraw";

export interface Account {
  accountId: number;
  bank: string;
  accountNumber: string;
  accountName: string;
  balance: number;
}

export interface TransactionData {
  type: TransactionType;
  selectedAccount: Account;
  amount: number;
  memo?: string;
}
