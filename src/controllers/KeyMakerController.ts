import { Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core';
import { Post, Get } from '@nestjs/common/decorators/http';
import axios from 'axios';
import { KeyObject } from 'crypto';
import { BlockChain } from '../models/Blockchain';
import { KeyMaker } from '../models/KeyMaker';
import { getBroadcast } from '../util';

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
