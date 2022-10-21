import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-etherscan';
import '@nomicfoundation/hardhat-chai-matchers';
// import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-truffle5';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';

// const INFURA_API_KEY = process.env.VITE_INFURA_API_KEY || '';
const PRIVATE_KEY1 = process.env.PRIVATE_KEY1 || '';
const PRIVATE_KEY2 = process.env.PRIVATE_KEY2 || '';
const ETHERSCAN_API_KEY = process.env.VITE_ETHERSCAN_API_KEY;
const QUIKNODE_GOERLI = process.env.VITE_QUIKNODE_GOERLI || '';
const VITE_ALCHEMY = process.env.VITE_ALCHEMY || '';
const VITE_ALCHEMY_POL = process.env.VITE_ALCHEMY_POL || '';
const VITE_BINA = process.env.VITE_BINA || '';
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY || '';
const BSCSCAN_API_KEY = process.env.BSCSCAN_API_KEY || '';

// const url = `https://ropsten.infura.io/v3/${INFURA_API_KEY}`;
// const url1 = `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`;
// const url2 = `https://kovan.infura.io/v3/${INFURA_API_KEY}`;
const url4 = `https://fragrant-few-sunset.ethereum-goerli.discover.quiknode.pro/${QUIKNODE_GOERLI}`;
const url5 = `https://eth-goerli.g.alchemy.com/v2/${VITE_ALCHEMY}`;
const url6 = 'https://web3-trial.cloudflare-eth.com/v1/goerli';
const url7 = `https://polygon-mumbai.g.alchemy.com/v2/${VITE_ALCHEMY}`;
const matic = `https://polygon-mainnet.g.alchemy.com/v2/${VITE_ALCHEMY_POL}`;
const binance = `https://nd-087-603-624.p2pify.com/${VITE_BINA}`;
const binanceT = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
// console.log('url4: ', url4);

// interface Etherscan {
//   etherscan: { apiKey: string | undefined };
// }

// type HardhatUserEtherscanConfig = HardhatUserConfig & Etherscan;

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  paths: {
    artifacts: 'src/artifacts',
  },
  defaultNetwork: 'alchemy',
  networks: {
    hardhat: {},
    localhost: {},
    matic: {
      url: matic,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
    },
    matictest: {
      url: url7,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
    },
    binance: {
      url: binance,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
    },
    binancetest: {
      url: binanceT,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
    },
    goerli: {
      url: url4,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
    },
    alchemy: {
      url: url5,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
    },
    zp: {
      url: url6,
      accounts: [PRIVATE_KEY1, PRIVATE_KEY2],
    },
    coverage: {
      url: 'http://127.0.0.1:8555', // Coverage launches its own ganache-cli client
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: {
      //ethereum
      mainnet: `${ETHERSCAN_API_KEY}`,
      goerli: `${ETHERSCAN_API_KEY}`,
      bscTestnet: `${BSCSCAN_API_KEY}`,
      //polygon
      polygon: `${POLYGONSCAN_API_KEY}`,
      polygonMumbai: `${POLYGONSCAN_API_KEY}`,
    },
  },
  mocha: {
    timeout: 100000,
  },
};

// https://fragrant-few-sunset.ethereum-goerli.discover.quiknode.pro/1aa44bb209eef431cdcebb98eaf50c01f7c14d39/
export default config;
