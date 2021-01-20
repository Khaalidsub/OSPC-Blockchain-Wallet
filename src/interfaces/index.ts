export interface ITransaction {
  transactionId?: String;
  sender: String;
  recipient: String;
  transctionType: TransactionType;
  timestamp?: number;
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

export interface INetwork {
  nodeUrl: string;
  timestamp?: number;
}

export enum TransactionType {
  topup = 'topup',
  register = 'register',
  booking = 'booking',
  mine = 'mine',
  certificate = 'certificate',
}

export interface data {}
