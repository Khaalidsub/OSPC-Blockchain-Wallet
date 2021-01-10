import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { BlockchainController } from './controllers/BlockchainController';
import { KeyMakerController } from './controllers/KeyMakerController';
import { TransactionController } from './controllers/TransactionController';
import { BlockChain } from './models/Blockchain';
import { KeyMaker } from './models/KeyMaker';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [
    TransactionController,
    KeyMakerController,
    BlockchainController,
  ],
  providers: [BlockChain, KeyMaker],
})
export class AppModule {}
