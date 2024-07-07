import exp from "constants";
import { BigNumberish } from "ethers";
import path from "path";

const { ethers } = require("ethers");
const { StrategyABI, strategyBytecode } = require("./StrategyAbi");

// const dotenv = require("dotenv");
// dotenv.config({ path: path.join(__dirname, "../../.env") });

const deployStrategy = async (signer: any, verifierAddress: string) => {
  // const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // const privateKey = process.env.PRIVATE_KEY;
  // const wallet = new ethers.Wallet(privateKey, provider);

  // Create a ContractFactory
  const factory = new ethers.ContractFactory(
    StrategyABI,
    strategyBytecode,
    signer
  );

  const WETH_ADDR = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
  const USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  const strategyName = "AIStrategy";
  const symbol = "AIS";
  const positionManager = "0x1238536071E1c677A632429e3655c799b22cDA52";
  const swapRouter = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E";

  const scalers = [
    "7455504813211",
    "2953758299944270168064",
    "1838876263346026577920",
  ];
  const minAdditions = ["1729926753534472704", "262951735771738", "0"];

  // Deploy the contract
  const contract = await factory.deploy(
    WETH_ADDR,
    strategyName,
    symbol,
    positionManager,
    swapRouter,
    verifierAddress,
    scalers,
    minAdditions
  );

  // Wait for the contract to be mined
  let txRes = await contract.deployTransaction.wait();

  console.log("Strategy deployed to:", txRes.contractAddress);

  return txRes.contractAddress;
};

const depositToStrategy = async (
  signer: any,
  depositAmount: BigNumberish,
  strategyAddress: string
) => {
  // const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  // const privateKey = process.env.PRIVATE_KEY;
  // const wallet = new ethers.Wallet(privateKey, provider);

  // Create a contract instance
  const strategyContract = new ethers.Contract(
    strategyAddress,
    StrategyABI,
    signer
  );

  console.log("Strategy contract:", strategyContract);

  // const WETH_ADDR = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
  // const USDC = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

  // ! TOKENS SHOULD ALREADY BE APPROVED !!!!!!!!

  try {
    let recipient = signer._address;
    const tx = await strategyContract.deposit(depositAmount, recipient);

    const receipt = await tx.wait();

    console.log("Transaction receipt:", receipt.transactionHash);
    return receipt.transactionHash;
  } catch (error) {
    console.error("Error calling contract function:", error);
  }
};

// const verifierAddress = "0xF598d2390B62A0485c6E00aa97EbE9B5B0fB30Aa";
// deployStrategy(verifierAddress).catch(console.error);

// const strategyAddress = "0x9e056f6473d4Ac9073E469943500E6Be68758aFD";
// const depositAmount = ethers.utils.parseUnits("0.0001", 18);
// depositToStrategy(strategyAddress, depositAmount).catch(console.error);

export { deployStrategy, depositToStrategy };
