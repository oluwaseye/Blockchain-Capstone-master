const fs = require("fs");
const HDWalletProvider = require("truffle-hdwallet-provider");
const TruffleContract = require("truffle-contract");
const Web3 = require("web3");
require('dotenv').config();

const INFURA_KEY = process.env.INFURA_KEY;

const OWNER_ACCOUNT = process.env.ACCOUNT;
const MNEMONIC = process.env.MNEMONIC;

const A = [
      "0x0897c412cc40f8677cdce4f903121daf686e8f97235133b0c2cb7b496646bf9e",
      "0x1e46d176d6864c4bce9bd557c09e6a7dbd7e890b8f63d349aef2e3e0e7910cf7"
];
const B = [
      [
        "0x2ac14c256b08b113ea51f507c8b3933297f6251f715e9a6a2a3660188e4cebd4",
        "0x0ce6895d8dbec0bb77c6f32932f814c80108aeb91b98bc3fb695483eb2dc75ad"
      ],
      [
        "0x2ec853923a212ea1bb0b7f674829e681a4e9df29cda08d1111d36888d75bda27",
        "0x2ef9a38894a052093a1d70b7a17c00457cc28ad59880e18ba64252bba2280be2"
      ]
];
const C = [
      "0x01d6b9b903610fcf2a4a6a19237b9d60a0d7aec0ceb3a418dd58486b44eac91f",
      "0x1e651f82b48f5c2d65e27b9d41803c11ef45a7faa0beaf6dc969ee89621eec88"
];
const INPUT = [
  "0x0000000000000000000000000000000000000000000000000000000000000009",
  "0x0000000000000000000000000000000000000000000000000000000000000001",
];

(async () => {
  let provider = new HDWalletProvider(
    MNEMONIC,
    `https://rinkeby.infura.io/v3/${INFURA_KEY}`
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
