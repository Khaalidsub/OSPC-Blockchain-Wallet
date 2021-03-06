import { Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core';
import { Body, Post, Get } from '@nestjs/common/decorators/http';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { IHashBlock, ITransaction } from '../interfaces';
import { BlockChain } from '../models/Blockchain';
import { getBroadcast, postBroadcast } from '../util';

@Controller('blockchain')
export class BlockchainController {
  private readonly logger = new Logger(BlockchainController.name);
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
        'blockchain/recieve-new-block',
        this.blockchain,
        newBlock,
      );

      const [{ data }] = await axios.all(requestPromises);
      this.logger.error(`sending the new mined block : ${data}`);
      console.log(data);

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
  recieveNewBlock(@Body() newBlock: IHashBlock) {
    this.logger.warn(`in recieve new block : ${newBlock.index}`);
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
    const blockchains = await axios.all<AxiosResponse<BlockChain>>(
      getBroadcast<BlockChain[]>('blockchain', this.blockchain),
    );
    const currentChainLength = this.blockchain.chain.length;
    let maxChainLength = currentChainLength;
    let newLongestChain: IHashBlock[] = null;
    let newPendingTransactions: ITransaction[] = null;

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
