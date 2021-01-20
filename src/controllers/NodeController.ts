import { Logger } from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core';
import { Body, Post, Get, Delete } from '@nestjs/common/decorators/http';
import axios, { AxiosResponse } from 'axios';
import { INetwork } from 'src/interfaces';
import { BlockChain } from 'src/models/Blockchain';
import { KeyMaker } from 'src/models/KeyMaker';

import { isNodeExist, postBroadcast } from 'src/util';

@Controller('node')
export class NodeController {
  private readonly logger = new Logger(NodeController.name);
  constructor(private blockchain: BlockChain, private keymaker: KeyMaker) {}

  @Get('')
  getAllNodes() {
    return this.blockchain.networkNodes;
  }

  //friend within the network who is telling others about his friend
  @Post('/register-and-broadcast-node')
  async registerNodeAndBroadCast(@Body('newNodeUrl') newNodeUrl: string) {
    this.logger.log(
      `register nodes and broadcast with the address: ${newNodeUrl}`,
    );

    this.blockchain.addNewNodeNetwork(newNodeUrl);

    try {
      const requestBroadcast: Promise<
        AxiosResponse<any>
      >[] = postBroadcast<string>(
        'node/register-node',
        this.blockchain,
        newNodeUrl,
      );

      await axios.all(requestBroadcast);
      let networks: string[] = this.blockchain.getNodeUrls();

      const requestRegisterBulk: Promise<AxiosResponse<any>>[] = postBroadcast<
        string[]
      >('node/register-nodes-bulk', this.blockchain, networks);

      await axios.all(requestRegisterBulk);

      return { note: 'New node registered with network successfully.' };
    } catch (error) {
      this.logger.error(
        `In the registerNodeAndBroadCast ${this.blockchain.currentNodeUrl} and caught ${error}`,
      );
      return error.message;
    }
  }

  @Post('/register-node')
  registerNode(@Body('newNodeUrl') newNodeUrl: string) {
    this.logger.log(`register node... ${newNodeUrl}`);
    if (newNodeUrl === undefined || newNodeUrl === null) {
      this.logger.error(`undefined node url!`);
      return;
    }
    this.blockchain.addNewNodeNetwork(newNodeUrl);

    return { note: 'New node registered successfully.' };
  }

  @Get('ping')
  pingNodes() {
    //check the nodes registered within the networkurls
    //give certain time
    //if node does not respond , remove the networkulr
  }
  @Delete('remove')
  removeNode() {}
  @Get('request')
  requestToJoin() {
    //check who is within the network
    //request the node to join the network
  }

  //get the nodes from the friend you asked
  @Post('/register-nodes-bulk')
  registerNodeBulk(@Body() allNetworkNodes: string[]) {
    this.logger.log(`register  in bulk:... ${allNetworkNodes}`);
    allNetworkNodes.forEach((networkNodeUrl) => {
      this.blockchain.addNewNodeNetwork(networkNodeUrl);
    });

    return { note: 'Bulk registration successful.' };
  }
}
