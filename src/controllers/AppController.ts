import { Controller, Get, HttpService, Post, Render } from '@nestjs/common';
import { BlockChain } from 'src/models/Blockchain';

@Controller()
export class AppController {
  constructor(
    private readonly blockchain: BlockChain,
    private httpService: HttpService,
  ) {}

  @Get()
  @Render('index')
  getHome() {
    const chains = this.blockchain.chain;
    const nodes = this.blockchain.networkNodes;
    const pendingTransactions = this.blockchain.pendingTransactions;
    const node = this.blockchain.currentNodeUrl.slice(
      this.blockchain.currentNodeUrl.lastIndexOf('/') + 1,
    );
    return { node, chains, nodes, pendingTransactions };
  }
  @Post('create-transaction')
  @Render('index')
  async createTransaction() {
    await this.httpService
      .post(`${this.blockchain.currentNodeUrl}/transaction/add`, {
        transaction: {
          sender: 'khaalid',
          recipient: 'ibrahim',
          transactionType: 'topup',
          data: { charge: '15.0' },
        },
      })
      .toPromise();
    return this.getHome();
  }

  @Post('create-block')
  @Render('index')
  async createBlock() {
    await this.httpService
      .get(`${this.blockchain.currentNodeUrl}/blockchain/mine`)
      .toPromise();
    return this.getHome();
  }

  @Get('consensus')
  @Render('index')
  async consensus() {
    await this.httpService
      .get(`${this.blockchain.currentNodeUrl}/blockchain/consensus`)
      .toPromise();
    return this.getHome();
  }
}
