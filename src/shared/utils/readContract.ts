import { Toffer, TauctionData } from "../persistence/offer.persistence";
import Web3 from "web3";
import dotenv from "dotenv";
dotenv.config();

import marketplace_ABI from "../contracts/marketPlaceABI";
import ERC20_ABI from "../contracts/mockERC20ABI";
import ERC721_ABI from "../contracts/mockERC721ABI";

const ERC20_CONTRACT_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS;
const ERC721_CONTRACT_ADDRESS = process.env.ERC721_CONTRACT_ADDRESS;
const SETTLER_CONTRACT_MARKETPLACE_ADDRESS =
  process.env.SETTLER_CONTRACT_MARKETPLACE_ADDRESS;
const PRIVAVE_KEYS = JSON.parse(process.env.PRIVAVE_KEYS as string);

const web3 = new Web3(process.env.INFURA_URL);
const erc20_contract = new web3.eth.Contract(ERC20_ABI, ERC20_CONTRACT_ADDRESS);
const erc721_contract = new web3.eth.Contract(
  ERC721_ABI,
  ERC721_CONTRACT_ADDRESS,
);
const marketplace_contract = new web3.eth.Contract(
  marketplace_ABI,
  SETTLER_CONTRACT_MARKETPLACE_ADDRESS,
);

export async function newAuctionsValue(address: string): Promise<any> {
  try {
    return await erc20_contract.methods.allowance(address, address).call();
  } catch (err) {
    console.log(err)
    throw new Error("Error AuctionsValue");
  }
}

export async function haveToken(token: Toffer): Promise<any> {
  try {
    const balance = await erc721_contract.methods.ownerOf(token.tokenID).call();
    if (balance != token.sellerAddress)
      throw new Error("it is not your token ");
    return balance;
  } catch (err) {
    throw new Error("Error balance");
  }
}

export async function getBalanceERC20(address: string): Promise<any> {
  try {
    const balance = await erc20_contract.methods.balanceOf(address).call();
    return balance;
  } catch (err) {
    throw new Error("Error balance");
  }
}

export async function validateFound(
  balance1: number,
  balance2: number,
): Promise<void> {
  if (
    web3.utils.fromWei(balance1, "ether") <=
    web3.utils.fromWei(balance2, "ether")
  )
    throw new Error(`You not have funds for this token`);
}

export async function signatureData(
  messageHash: string,
  privateKey: string,
): Promise<string> {
  const signedMessage = await web3.eth.accounts.sign(messageHash, privateKey);
  console.log(signedMessage);
  return signedMessage.signature;
}

export function createBidderHash(bidderSig: string): string {
  const bidMessageHash = web3.utils.soliditySha3(bidderSig);
  console.log(".....")
  if (!bidMessageHash)
    throw new Error("Bid message hash could not be generated.");
  return bidMessageHash;
}

export function createMessageHash(
  erc721Address: string,
  erc20Address: string,
  tokenId: string,
  bid: number,
): string {
  const bidMessageHash = web3.utils.soliditySha3(
    { type: "address", value: erc721Address },
    { type: "address", value: erc20Address },
    { type: "uint256", value: tokenId },
    { type: "uint256", value: bid },
  );
  if (!bidMessageHash) throw new Error("message have not generated");
  return bidMessageHash;
}