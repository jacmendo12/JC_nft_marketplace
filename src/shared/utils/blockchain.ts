import { Toffer } from '../persistence/offer.persistence';
import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

import marketplace_ABI from '../contracts/marketPlaceABI';
import ERC20_ABI from '../contracts/mockERC20ABI';
import ERC721_ABI from '../contracts/mockERC721ABI';


const ERC20_CONTRACT_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS;
const ERC721_CONTRACT_ADDRESS = process.env.ERC721_CONTRACT_ADDRESS;
const SEPOLIA_CONTRACT_MARKETPLACE_ADDRESS = process.env.SEPOLIA_CONTRACT_MARKETPLACE_ADDRESS;
const PRIVAVE_KEYS = JSON.parse(process.env.PRIVAVE_KEYS as string)

const web3 = new Web3(process.env.INFURA_URL);
const erc20_contract = new web3.eth.Contract(ERC20_ABI, ERC20_CONTRACT_ADDRESS);
const erc721_contract = new web3.eth.Contract(ERC721_ABI, ERC721_CONTRACT_ADDRESS);

export async function buyToken(token: Toffer, buyerAddress: string): Promise<any> {
    try {
        const privateKeyByAddress = PRIVAVE_KEYS.find((data: any) => data.addres == buyerAddress)
        if (!privateKeyByAddress)
            throw new Error("this wallet not exist");

        const block = await web3.eth.getBlock('latest');
        const gasLimit = Math.round(Number(block.gasLimit) / block.transactions.length);
        const hashAproved = await AproveTransaction(token, buyerAddress, gasLimit)

        let data = await erc20_contract.methods.transfer(token.sellerAddress, token.value).encodeABI();
        const transactionObjectErc20 = {
            from: buyerAddress,
            to: ERC20_CONTRACT_ADDRESS,
            gas: gasLimit,
            gasPrice: await web3.eth.getGasPrice(),
            data: data
        };
        console.log("transactionObjectErc20>", transactionObjectErc20)
        const SignedTransactionERC20 = await signature(transactionObjectErc20, privateKeyByAddress.privateKey)
        console.log("SignedTransactionERC20>", SignedTransactionERC20)

        console.log("---erc721 coontract----")
        data = await erc721_contract.methods.transferFrom(token.sellerAddress, buyerAddress, token.tokenID).encodeABI();
        // const balance = await erc721_contract.methods.balanceOf(token.sellerAddress).call()
        const transactionObjectErc721 = {
            from: buyerAddress,
            to: ERC721_CONTRACT_ADDRESS,
            gas: gasLimit,
            gasPrice: await web3.eth.getGasPrice(),
            data: data
        };
        console.log("transactionObjectErc721>", transactionObjectErc721)
        const SignedTransactionERC721 = await signature(transactionObjectErc721, privateKeyByAddress.privateKey)
        console.log("SignedTransactionERC721>", SignedTransactionERC721)

        return {
            "erc20Hash":SignedTransactionERC20.transactionHash,
            "erc721Hash": SignedTransactionERC721.transactionHash,
            "hashAproved": hashAproved
        }
    } catch (err: any) {
        console.log(err)
        throw new Error(err.reason || err.message || "Error to buy token");
    }

}

export async function AproveTransaction(token: Toffer, buyerAddress: string, gasLimit: number): Promise<any> {
    try {
        const privateKeyByAddress = PRIVAVE_KEYS.find((data: any) => data.addres == token.sellerAddress)
        await haveToken(token)
        console.log("---Aprobe token---")
        const data = await erc721_contract.methods.approve(buyerAddress, token.tokenID).encodeABI();
        const transactionObjectErc721 = {
            from: token.sellerAddress,
            to: ERC721_CONTRACT_ADDRESS,
            gas: gasLimit,
            gasPrice: await web3.eth.getGasPrice(),
            data: data
        };
        console.log("transactionObjectErc721>", transactionObjectErc721)
        const SignedTransactionERC721 = await signature(transactionObjectErc721, privateKeyByAddress.privateKey)
        console.log("SignedTransactionERC721>", SignedTransactionERC721)

        return SignedTransactionERC721.transactionHash
    } catch (err: any) {
        console.log(err)
        throw new Error(err.reason || err.message || "Error to buy token");
    }
}

export async function signature(transactionObject: any, privateKeyByAddress: any): Promise<any> {
    try {
        const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, privateKeyByAddress);
        const sendSignedTransaction = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
        return sendSignedTransaction
    } catch (err: any) {
        throw new Error(err.reason || err.message || "Error to buy token");
    }
}

export async function haveToken(token: Toffer): Promise<any> {
    try {
        const balance = await erc721_contract.methods.ownerOf(token.tokenID).call()
        if (balance != token.sellerAddress)
            throw new Error('it is not your token ');
        return balance
    } catch (err) {
        throw new Error('Error balance');
    }
}

export async function getBalanceERC20(address: string): Promise<any> {
    try {
        const balance = await erc20_contract.methods.balanceOf(address).call()
        return balance
    } catch (err) {
        throw new Error('Error balance');
    }
}

export async function validateFound(balance1: number, balance2: number): Promise<void> {
    if (web3.utils.fromWei(balance1, 'ether') <= web3.utils.fromWei(balance2, 'ether'))
        throw new Error(`You not have funds for this token`);

}