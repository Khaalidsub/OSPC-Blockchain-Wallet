import { Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core';
import { Post, Get, Param, Body } from '@nestjs/common/decorators/http';
import { BlockChain } from '../models/Blockchain';
import { KeyMaker } from '../models/KeyMaker';
import { Transaction } from '../models/Transaction';

@Controller('transaction')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);
  constructor(private blockchain: BlockChain, private keymaker: KeyMaker) {}
  @Post('add')
  addTransaction(@Body('transaction') transaction: Transaction) {
    // const isValid = this.keymaker.verifySignature(transaction, signature);
    this.logger.verbose(`adding a transaction.. ${transaction} `);
    // if (isValid) {

    this.blockchain.addTransactionToPendingTransaction(transaction);
    return true;
    // }
    // return false;
  }
  //   broadCastTransaction() {}
  @Get(':id')
  getTransaction(@Param('id') transactionId: string) {
    return this.blockchain.getTransaction(transactionId);
  }
}
