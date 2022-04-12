import { isValidAddress } from 'ethereumjs-util';
import {
  Account,
  AddTransactionResponse,
  CompressedCompiledContract,
  Provider,
  Signature,
} from 'starknet';
import { hexToDecimalString } from 'starknet/utils/number';

import { MetamaskClient } from '../client';
import { contractSalt, implementationAddress } from '../config';
import { PersonalSigner } from '../signer';
import { Chain, NetworkName } from '../types';
import { chainForNetwork, computeAddress } from '../utils';
import contract_deploy_tx from '../web3_account_proxy.json';

export class EthAccount extends Account {
  private readonly chain: Chain;
  private readonly ethAddress: string;

  constructor(
    provider: Provider,
    client: MetamaskClient,
    ethAddress: string,
    network: NetworkName
  ) {
    if (!isValidAddress(ethAddress)) {
      throw new Error('Provided address is not valid ethereum address.');
    }

    const chain = chainForNetwork(network);
    const starknetAddress = computeAddress(ethAddress, chain.chainId);

    // const signer = new Eip712Signer(client, ethAddress, chain);
    const signer = new PersonalSigner(client, ethAddress);
    super(provider, starknetAddress, signer);

    this.chain = chain;
    this.ethAddress = ethAddress;
  }

  signMessage(): Promise<Signature> {
    throw new Error('signMessage is not supported for EthAccount');
  }

  /* Account deployment methods */

  public async isDeployed(): Promise<boolean> {
    const code = await this.getCode(this.address);
    return !!code.bytecode.length;
  }

  // public async callContract(
  //   { contractAddress, entrypoint, calldata = [] }: Call,
  //   { blockIdentifier = 'pending' }: { blockIdentifier?: BlockIdentifier } = {}
  // ): Promise<CallContractResponse> {
  //   return this.fetchEndpoint(
  //     'call_contract',
  //     { blockIdentifier },
  //     {
  //       signature: [],
  //       contract_address: contractAddress,
  //       entry_point_selector: getSelectorFromName(entrypoint),
  //       calldata: [getSelectorFromName(entrypoint), ...calldata],
  //     }
  //   );
  // }

  // public async getNonce(): Promise<string> {
  //   try {
  //     const { result } = await this.callContract({
  //       contractAddress: this.address,
  //       entrypoint: getSelectorFromName('get_nonce'),
  //     });

  //     return toHex(toBN(result[0]));
  //   } catch (e) {
  //     console.log('Error while getting nonce');
  //     console.error(e);
  //     throw e;
  //   }
  // }

  public deployAccount = async (): Promise<AddTransactionResponse> => {
    const deploymentResult = await this.fetchEndpoint(
      'add_transaction',
      undefined,
      {
        type: 'DEPLOY',
        contract_address_salt: contractSalt,
        constructor_calldata: [hexToDecimalString(implementationAddress)],
        contract_definition:
          contract_deploy_tx.contract_definition as CompressedCompiledContract,
      }
    );

    // await this.callContract({
    //   contractAddress: this.address,
    //   entrypoint: 'initializer',
    //   calldata: [
    //     hexToDecimalString(this.address),
    //     hexToDecimalString(this.ethAddress),
    //     this.chain.chainId.toString(),
    //   ],
    // });
    console.log(this.chain);
    console.log(this.ethAddress);

    return deploymentResult;
  };
}
