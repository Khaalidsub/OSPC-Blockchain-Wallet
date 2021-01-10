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
import { KeyMaker } from 'src/models/KeyMaker';

@Controller('keymaker')
export class KeyMakerController {
  private readonly logger = new Logger(KeyMakerController.name);
  constructor(private keymaker: KeyMaker) {}
  @Post()
  generateKeys() {}
  broadcastKey() {}
}
