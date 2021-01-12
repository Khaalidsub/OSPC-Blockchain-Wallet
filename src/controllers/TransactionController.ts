import { Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core';
import {
  Body,
  Post,
  Get,
  Delete,
  Put,
  Param,
} from '@nestjs/common/decorators/http';
import { BlockChain } from 'src/models/Blockchain';
import { KeyMaker } from 'src/models/KeyMaker';
import { Transaction } from 'src/models/Transaction';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private blockchain: BlockChain, private keymaker: KeyMaker) {}
  @Post('add')
  addTransaction(transaction: Transaction, signature: string) {
    const isValid = this.keymaker.verifySignature(transaction, signature);
    this.logger.verbose(`adding a transaction.. ${transaction} ${signature}`);
    if (isValid) {
      this.blockchain.addTransactionToPendingTransaction(transaction);
      return true;
    }
    return false;
  }
  //   broadCastTransaction() {}
  @Get(':id')
  getTransaction(transactionId: string) {
    return this.blockchain.getTransaction(transactionId);
  }
}
