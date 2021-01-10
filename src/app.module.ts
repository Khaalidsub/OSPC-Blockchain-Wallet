import { Module } from '@nestjs/common';
import { BlockchainController } from './controllers/BlockchainController';
import { KeyMakerController } from './controllers/KeyMakerController';
import { TransactionController } from './controllers/TransactionController';
import { BlockChain } from './models/Blockchain';
import { KeyMaker } from './models/KeyMaker';

@Module({
  imports: [],
  controllers: [
    TransactionController,
    KeyMakerController,
    BlockchainController,
  ],
  providers: [BlockChain, KeyMaker],
})
export class AppModule {}
