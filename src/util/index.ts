import axios, { AxiosResponse } from 'axios';
import { INetwork } from 'src/interfaces';
import { BlockChain } from 'src/models/Blockchain';

export enum Routes {
  blockchain = '',
  recieveNewBlock = 'recieve-new-block',
}

export const postBroadcast = <T>(url: string, block: BlockChain, data: T) => {
  const requestPromises: Promise<AxiosResponse<any>>[] = [];
  block.networkNodes.forEach(({ nodeUrl }) => {
    if (nodeUrl !== null) {
      requestPromises.push(axios.post(`${nodeUrl}/${url}`, data));
    }
  });
  console.log('postBroadCast', ...requestPromises);
  return requestPromises;
};
export const getBroadcast = <T>(url: string, block: BlockChain) => {
  const requestPromises: Promise<AxiosResponse<any>>[] = [];
  block.networkNodes.forEach(({ nodeUrl }) => {
    requestPromises.push(axios.get(`${nodeUrl}/${url}`));
  });
  return requestPromises;
};
export const isNodeExist = (
  networkNodes: INetwork[],
  currentNode: string,
  newNode: string,
) => {
  const nodeNotAlreadyPresent =
    networkNodes.find(({ nodeUrl }) => nodeUrl === newNode) === undefined;
  console.table(networkNodes);
  console.log('in isNodeExist', nodeNotAlreadyPresent);

  const notCurrentNode = currentNode !== newNode;
  // const notNull = newNode !== null || newNode !== undefined;
  return nodeNotAlreadyPresent && notCurrentNode;
};

export const validateNodeStatus = (block: BlockChain) => {};
