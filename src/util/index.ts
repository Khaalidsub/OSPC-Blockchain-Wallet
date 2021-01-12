import axios, { AxiosResponse } from 'axios';
import { BlockChain } from 'src/models/Blockchain';

export enum Routes {
  blockchain = '',
  recieveNewBlock = 'recieve-new-block',
}

export const postBroadcast = <T>(url: string, block: BlockChain, data: T) => {
  const requestPromises: Promise<AxiosResponse<any>>[] = [];
  block.networkNodes.forEach((networkNodeUrl) => {
    requestPromises.push(axios.post(`${networkNodeUrl}/${url}`, data));
  });
  console.log('postBroadCast', ...requestPromises);
  return requestPromises;
};
export const getBroadcast = <T>(url: string, block: BlockChain) => {
  const requestPromises: Promise<AxiosResponse<any>>[] = [];
  block.networkNodes.forEach((networkNodeUrl) => {
    requestPromises.push(axios.get(`${networkNodeUrl}/${url}`));
  });
  return requestPromises;
};
export const isNodeExist = (
  networkNodes: String[],
  currentNode: String,
  newNode: String,
) => {
  const nodeNotAlreadyPresent = networkNodes.indexOf(newNode) == -1;
  const notCurrentNode = currentNode !== newNode;
  return nodeNotAlreadyPresent && notCurrentNode;
};

export const validateNodeStatus = (block: BlockChain) => {};
