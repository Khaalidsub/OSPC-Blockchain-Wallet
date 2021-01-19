import { HttpModule, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './controllers/AppController';
import { BlockchainController } from './controllers/BlockchainController';
import { KeyMakerController } from './controllers/KeyMakerController';
import { NodeController } from './controllers/NodeController';
import { TransactionController } from './controllers/TransactionController';
import { BlockChain } from './models/Blockchain';
import { KeyMaker } from './models/KeyMaker';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule],
  controllers: [
    TransactionController,
    KeyMakerController,
    BlockchainController,
    NodeController,
    AppController,
  ],
  providers: [BlockChain, KeyMaker],
})
export class AppModule {}
