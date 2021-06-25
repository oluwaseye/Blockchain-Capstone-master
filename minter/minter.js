const fs = require("fs");
const HDWalletProvider = require("truffle-hdwallet-provider");
const TruffleContract = require("truffle-contract");
const Web3 = require("web3");
require('dotenv').config();

const KEY = process.env.KEY; //infura key

const OWNER_ACCOUNT = "0x5CD32Dc7583D54710869F241C59B7dae1E8e4D24";
const MNEMONIC =
  "swamp thank festival palm ridge run kick host label caution major squirrel";

const A = [
  "0x1ba0df5159c4c75da8a30d34e28b0a2242b9634aed77c9b41b979e6081ed5033",
  "0x04a81e18c8c57362b000213bce6d533055ba4f830dc76abf9c5bf37907ffbdd0",
];
const B = [
  [
    "0x272c1132c59a11b904df2e3921eaf7b40ce948a1a24e9b36dd6e2e04cc3e9560",
    "0x1535e1e6c5cb4d685ef68595487910d68d8813765f422b977b53e32f8c53fc94",
  ],
  [
    "0x26e8a26d9bd754c038c42bb9b5b32b91a0c1463aba53b03eb8e224f1230f853a",
    "0x2c080f65faca972f26229da56b338fc12d62261f8626ec42659bc1090e7a983d",
  ],
];
const C = [
  "0x08c833d09a989255fa84bd16e9b4374fbf2c59f92f8b67298771b72c03e56f7f",
  "0x2f85944aef8c9f217463077e0d8f85fdf5546b3b570820ade0cf9c95a3feb440",
];
const INPUT = [
  "0x0000000000000000000000000000000000000000000000000000000000000009",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
];

(async () => {
  let provider = new HDWalletProvider(
    MNEMONIC,
    `https://rinkeby.infura.io/v3/${KEY}`
  );
  let web3 = new Web3(provider);
  let contractAbi = JSON.parse(
    fs.readFileSync(
      "../eth-contracts/build/contracts/SolnSquareVerifier.json",
      "utf-8"
    )
  );
  let solnSquareVerifier = TruffleContract(contractAbi);
  solnSquareVerifier.setProvider(provider);

  try {
    this.contract = await solnSquareVerifier.deployed();
  } catch (e) {
    console.log(
      `Failed to create contract instance...\n${e.message}\nexit program...`
    );
    process.exit(1);
  }

  let currentTokenSupply;
  try {
    currentTokenSupply = await this.contract.totalSupply();
  } catch (e) {
    console.log(
      `Failed to get total token supply...\n${e.message}\nexit program...`
    );
    process.exit(1);
  }
  console.log(`currentTotalSupply: ${currentTokenSupply.toNumber()}`);

  let nextTokenId = parseInt(currentTokenSupply.toNumber()) + 1;
  console.log(`nextTokenId: ${nextTokenId}`);

  try {
    await this.contract.addSolution(A, B, C, INPUT, { from: OWNER_ACCOUNT });
  } catch (e) {
    console.log(`Failed to add the solution...\n${e.message}\nexit program...`);
    process.exit(1);
  }

  try {
    await this.contract.mint(OWNER_ACCOUNT, nextTokenId, {
      from: OWNER_ACCOUNT,
    });
  } catch (e) {
    console.log(`Failed to mint the token...\n${e.message}\nexit program...`);
    process.exit(1);
  }

  console.log(`TokenId ${nextTokenId} has been minted successfully!!!!`);
  process.exit(0);
})();
