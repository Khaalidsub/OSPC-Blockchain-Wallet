import { ITransaction, TransactionType } from 'src/interfaces';

export class Transaction implements ITransaction {
  constructor(
    public sender: string,
    public recipient: string,
    public transctionType: TransactionType,
    public data: Object,
    public transactionId?: string,
  ) {}
}