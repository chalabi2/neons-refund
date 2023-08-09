import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import * as dotenv from 'dotenv';
dotenv.config();


declare module "hardhat/types/runtime" {
  interface HardhatRuntimeEnvironment {
    // ... (all the stuff from above)
  }
}

const RPCURL = "https://canto-testnet.plexnode.wtf";
const PRIVKEY = [process.env.PRIV_KEY || ''];
const RPCURLLOCAL = ""

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    canto: {
      url: RPCURL,
      accounts: PRIVKEY,
      chainId: 7701,
    },
    cantoLocal: {
      url: RPCURL,
      accounts: PRIVKEY,
      chainId: 7701,
    },
    hardhat: {
      forking: {
        url: "https://canto.ansybl.io/mainnet/evm_rpc/",
        blockNumber: 5446752,
        httpHeaders: {
          "X-API-KEY": "2beb9687b6d1105ecb689f7a"
        }
      }
    }
  },
};

export default config;
