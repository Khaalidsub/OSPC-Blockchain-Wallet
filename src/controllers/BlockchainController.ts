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
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { IHashBlock, ITransaction } from 'src/interfaces';
import { BlockChain } from 'src/models/Blockchain';
import { Transaction } from 'src/models/Transaction';
import { getBroadcast, postBroadcast } from 'src/util';
import { v1 as uuid } from 'uuid';
@Controller('blockchain')
export class BlockchainController {
  private readonly logger = new Logger(BlockchainController.name);
  private nodeAddress = uuid().split('-').join('');
  constructor(private blockchain: BlockChain) {}
  @Get()
  getchain() {
    return this.blockchain;
  }

  @Get('mine')
  async mine() {
    const lastBlock = this.blockchain.getLastBlock();
    const previousBlockHash = lastBlock['hash'] as String;
    const currentBlockData = {
      transactions: this.blockchain.pendingTransactions,
      index: lastBlock['index'] + 1,
    };
    const nonce = this.blockchain.proofOfWork(
      previousBlockHash,
      currentBlockData,
    );
    const blockHash = this.blockchain.hashBlock(
      previousBlockHash,
      currentBlockData,
      nonce,
    );
    const newBlock = this.blockchain.createNewBlock(
      nonce,
      previousBlockHash,
      blockHash,
    );
    this.logger.log(`new block has been mined.. ${newBlock} `);
    try {
      const requestPromises: Promise<
        AxiosResponse<any>
      >[] = postBroadcast<IHashBlock>(
        'recieve-new-block',
        this.blockchain,
        newBlock,
      );

      await axios.all(requestPromises);
      // const transaction: PaymentTransaction = {
      //   transactionType: TransactionType.mine,
      //   data: 12.5,
      //   sender: "00",
      //   recipient: this.nodeAddress,
      // };
      // await axios.post(`${this.blockchain.currentNodeUrl}/transaction/broadcast`, {
      //   transaction,
      //   signature: this.keyMaker.signNodeData(transaction),
      // });

      return {
        note: 'New blockchain mined & broadcast successfully',
        blockchain: newBlock,
      };
    } catch (error) {
      console.error(error);
    }
  }

  @Post('/recieve-new-block')
  recieveNewBlock(@Body('newBlock') newBlock: IHashBlock) {
    const lastBlock = this.blockchain.getLastBlock();
    const correctHash = lastBlock.hash === newBlock.previousBlockHash;
    const correctIndex = lastBlock['index'] + 1 === newBlock['index'];

    if (correctHash && correctIndex) {
      this.blockchain.chain.push(newBlock);
      this.blockchain.pendingTransactions = [];
      return {
        note: 'New blockchain received and accepted.',
        newBlock: newBlock,
      };
    } else {
      return {
        note: 'New blockchain rejected.',
        newBlock: newBlock,
      };
    }
  }
  @Get('consensus')
  async makeConsensus() {
    // const requestPromises: Promise<AxiosResponse<BlockChain>>[] = [];
    // this.blockchain.networkNodes.forEach((networkNodeUrl) => {
    //   requestPromises.push(axios.get(`${networkNodeUrl}/blockchain`));
    // });

    const blockchains = await axios.all(
      getBroadcast('blockchain', this.blockchain),
    );
    const currentChainLength = this.blockchain.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain: IHashBlock[] = [];
    let newPendingTransactions: ITransaction[] = [];

    blockchains.forEach((blockchain) => {
      if (blockchain.data.chain.length > maxChainLength) {
        maxChainLength = blockchain.data.chain.length;
        newLongestChain = blockchain.data.chain;
        newPendingTransactions = blockchain.data.pendingTransactions;
      }
    });

    if (
      !newLongestChain ||
      (newLongestChain && !this.blockchain.chainIsValid(newLongestChain))
    ) {
      return {
        note: 'Current chain has not been replaced.',
        chain: this.blockchain.chain,
      };
    } else {
      this.blockchain.chain = newLongestChain;
      this.blockchain.pendingTransactions = newPendingTransactions;
      return {
        note: 'This chain has been replaced.',
        chain: this.blockchain.chain,
      };
    }
  }
}
