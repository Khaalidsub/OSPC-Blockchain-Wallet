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
  constructor(private blockchain: BlockChain, private keymaker: KeyMaker) {}
  @Post()
  addTransaction(transaction: Transaction, signature: string) {
    this.keymaker.verifySignature(transaction, signature);
  }
  //   broadCastTransaction() {}
  @Get(':id')
  getTransaction(transactionId: string) {
    return this.blockchain.getTransaction(transactionId);
  }
}
