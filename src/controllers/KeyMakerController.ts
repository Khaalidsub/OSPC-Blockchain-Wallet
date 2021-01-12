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
import { KeyObject } from 'crypto';
import { BlockChain } from 'src/models/Blockchain';
import { KeyMaker } from 'src/models/KeyMaker';
import { getBroadcast, postBroadcast } from 'src/util';

@Controller('keymaker')
export class KeyMakerController {
  private readonly logger = new Logger(KeyMakerController.name);
  constructor(private keymaker: KeyMaker, private chain: BlockChain) {}
  @Post('generate')
  async generateKeys() {
    const key = this.keymaker.generateKeyPair();
    //broadcastKey
    await axios.all(
      getBroadcast(`keymaker/${this.keymaker.getPublicKey()}`, this.chain),
    );
    return key;
  }
  @Get(':keyId')
  getPublicKey(keyId: KeyObject) {
    this.logger.log(`recieving public key... ${keyId}`);
    if (this.keymaker.getPublicKey() !== keyId) {
      this.keymaker.setPublicKey(keyId);
    }
  }
}
