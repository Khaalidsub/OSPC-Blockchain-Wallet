import { Injectable } from '@nestjs/common/decorators/core';
import { sha256 } from 'sha.js';
import { IHashBlock, INetwork, ITransaction } from '../interfaces';

const currentNodeUrls = `${process.env.URL}`;
import { v1 as uuid } from 'uuid';
@Injectable()
export class BlockChain {
  public chain: IHashBlock[];
  public networkNodes: INetwork[];
  public pendingTransactions: ITransaction[];
  public currentNodeUrl = currentNodeUrls;

  constructor() {
    this.chain = [];
    this.networkNodes = [];
    this.pendingTransactions = [];
    this.createNewBlock(100, '0', '0');
  }

  createNewBlock(
    nonce: number,
    previousBlockHash: String,
    hash: String,
  ): IHashBlock {
    const newBlock = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      nonce: nonce,
      hash: hash,
      previousBlockHash: previousBlockHash,
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
  }

  getLastBlock(): IHashBlock {
    return this.chain[this.chain.length - 1];
  }

  addTransactionToPendingTransaction(transaction: ITransaction): number {
    transaction.timestamp = Date.now();
    transaction.transactionId = uuid();
    this.pendingTransactions.push(transaction);
    return this.getLastBlock()['index'] + 1;
  }

  hashBlock(
    previousBlockHash: String,
    currentBlockData: IHashBlock,
    nonce: number,
  ): string {
    const dataAsString =
      previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = new sha256().update(dataAsString).digest('hex');

    return hash;
  }

  proofOfWork(previousBlockHash: String, currentBlockData: IHashBlock): number {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    while (hash.substring(0, 4) !== '0000') {
      nonce++;
      hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
    }

    return nonce;
  }

  chainIsValid(blockchain: IHashBlock[]): boolean {
    let validChain = true;

    for (var i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];
      const blockHash = this.hashBlock(
        prevBlock['hash'] as String,
        {
          transactions: currentBlock['transactions'],
          index: currentBlock['index'],
        },
        currentBlock['nonce'] as number,
      );
      if (blockHash.substring(0, 4) !== '0000') validChain = false;
      if (currentBlock['previousBlockHash'] !== prevBlock['hash'])
        validChain = false;
    }

    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0;

    if (
      !correctNonce ||
      !correctPreviousBlockHash ||
      !correctHash ||
      !correctTransactions
    )
      validChain = false;

    return validChain;
  }

  getBlock(blockHash: String): IHashBlock {
    let correctBlock = null;
    this.chain.forEach((block) => {
      if (block.hash === blockHash) correctBlock = block;
    });
    return correctBlock;
  }
  getTransaction(
    transactionId: String,
  ): { transaction: ITransaction; block: IHashBlock } {
    let correctTransaction: ITransaction = null;
    let correctBlock: IHashBlock = null;

    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        if (transaction.transactionId === transactionId) {
          correctTransaction = transaction;
          correctBlock = block;
        }
      });
    });

    return {
      transaction: correctTransaction,
      block: correctBlock,
    };
  }

  getAddressData(address: String): ITransaction[] {
    const addressTransactions: ITransaction[] = [];
    this.chain.forEach((block) => {
      block.transactions.forEach((transaction) => {
        if (
          transaction.sender === address ||
          transaction.recipient === address
        ) {
          addressTransactions.push(transaction);
        }
      });
    });

    return addressTransactions;
  }
}
