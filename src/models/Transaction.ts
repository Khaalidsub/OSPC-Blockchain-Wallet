import { ITransaction, TransactionType } from '../interfaces';

export class Transaction implements ITransaction {
  constructor(
    public sender: string,
    public recipient: string,
    public transctionType: TransactionType = TransactionType.topup,
    public data: Object,
    public transactionId?: string,
  ) {}
}
