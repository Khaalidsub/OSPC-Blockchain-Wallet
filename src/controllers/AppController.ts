import { Controller, Get, Render } from '@nestjs/common';
import { BlockChain } from 'src/models/Blockchain';

@Controller()
export class AppController {
  constructor(private readonly blockchain: BlockChain) {}

  @Get()
  @Render('index')
  getHello() {
    const chains = this.blockchain.chain;
    const nodes = this.blockchain.networkNodes;
    const pendingTransactions = this.blockchain.pendingTransactions;

    return { chains, nodes, pendingTransactions };
  }
}
