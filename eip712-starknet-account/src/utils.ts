import { fromRpcSig } from 'ethereumjs-util';
import { Signature } from 'starknet';
import {
  computeHashOnElements,
  getSelectorFromName,
} from 'starknet/utils/hash';

import { contractHash, contractSalt, implementationAddress } from './config';

const RECOVERY_OFFSET = 27;

export const parseSignature = (signature: string): Signature => {
  const { v, r, s } = fromRpcSig(signature);

  const rHigh = '0x' + r.slice(0, 16).toString('hex');
  const rLow = '0x' + r.slice(16, 32).toString('hex');

  const sHigh = '0x' + s.slice(0, 16).toString('hex');
  const sLow = '0x' + s.slice(16, 32).toString('hex');

  const vStr = '0x' + (v - RECOVERY_OFFSET).toString(16);

  return [vStr, rLow, rHigh, sLow, sHigh];
};

export const computeStarknetAddress = (ethAddress: string) =>
  computeHashOnElements([
    '0x' + new Buffer('STARKNET_CONTRACT_ADDRESS', 'ascii').toString('hex'),
    0,
    contractSalt,
    contractHash,
    computeHashOnElements([
      implementationAddress,
      getSelectorFromName('initializer'),
      '1',
      ethAddress,
    ]),
  ]);
