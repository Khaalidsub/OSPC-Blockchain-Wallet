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

@Controller('blockchain')
export class BlockchainController {
  constructor(private blockchain: BlockChain) {}
  @Post()
  broadcastBlock() {}
  makeConsensus() {}
  mine() {}
}
