export interface ITransaction {
  transactionId?: String;
  sender: String;
  recipient: String;
  transctionType: TransactionType;
  data: Object;
}

export interface IHashBlock {
  index: number;
  timestamp?: number;
  transactions: ITransaction[];
  nonce?: number;
  hash?: String;
  previousBlockHash?: String;
}

export enum TransactionType {
  topup,
  register,
  booking,
  mine,
  certificate,
}

export interface data {}
