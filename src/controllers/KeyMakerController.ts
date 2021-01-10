import { Controller } from '@nestjs/common/decorators/core';
import {
  Body,
  Post,
  Get,
  Delete,
  Put,
  Param,
} from '@nestjs/common/decorators/http';
import { KeyMaker } from 'src/models/KeyMaker';

@Controller('keymaker')
export class BlockchainController {
  constructor(private keymaker: KeyMaker) {}
  @Post()
  generateKeys() {}
  broadcastKey() {}
}
