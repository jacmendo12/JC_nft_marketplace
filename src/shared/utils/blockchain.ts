import { Toffer, TauctionData } from '../persistence/offer.persistence';
import Web3 from 'web3';
import dotenv from 'dotenv';
dotenv.config();

import marketplace_ABI from '../contracts/marketPlaceABI';
import ERC20_ABI from '../contracts/mockERC20ABI';
import ERC721_ABI from '../contracts/mockERC721ABI';


const ERC20_CONTRACT_ADDRESS = process.env.ERC20_CONTRACT_ADDRESS;
const ERC721_CONTRACT_ADDRESS = process.env.ERC721_CONTRACT_ADDRESS;
const SETTLER_CONTRACT_MARKETPLACE_ADDRESS = process.env.SETTLER_CONTRACT_MARKETPLACE_ADDRESS;
const PRIVAVE_KEYS = JSON.parse(process.env.PRIVAVE_KEYS as string)

const web3 = new Web3(process.env.INFURA_URL);
const erc20_contract = new web3.eth.Contract(ERC20_ABI, ERC20_CONTRACT_ADDRESS);
const erc721_contract = new web3.eth.Contract(ERC721_ABI, ERC721_CONTRACT_ADDRESS);
const marketplace_contract = new web3.eth.Contract(marketplace_ABI, SETTLER_CONTRACT_MARKETPLACE_ADDRESS);

export async function buyToken(token: Toffer, buyerAddress: string): Promise<any> {
    try {
        const privateKeyByAddress = PRIVAVE_KEYS.find((data: any) => data.addres == buyerAddress)
        if (!privateKeyByAddress)
            throw new Error("this wallet not exist");

        const block = await web3.eth.getBlock('latest');
        const gasLimit = Math.round(Number(block.gasLimit) / block.transactions.length);
        const hashAproved = await AproveTransactionERC721(token, buyerAddress)

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
            "erc20Hash": SignedTransactionERC20.transactionHash,
            "erc721Hash": SignedTransactionERC721.transactionHash,
            "hashAproved": hashAproved
        }
    } catch (err: any) {
        console.log(err)
        throw new Error(err.reason || err.message || "Error to buy token");
    }

}

export async function AproveTransactionERC721(token: Toffer, buyerAddress: string): Promise<any> {
    try {
        const block = await web3.eth.getBlock('latest');
        const gasLimit = Math.round(Number(block.gasLimit) / block.transactions.length);
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

export async function auctions(token: Toffer, buyerAddress: string, valueSpend: number, auctionsType: number = 1): Promise<any> {
    try {
        const privateKeyByAddress = PRIVAVE_KEYS.find((data: any) => data.addres == buyerAddress)
        const block = await web3.eth.getBlock('latest');
        const gasLimit = Math.round(Number(block.gasLimit) / block.transactions.length);

        let data = ""
        if (auctionsType == 1) // approve
            data = await erc20_contract.methods.approve(token.sellerAddress, valueSpend).encodeABI();
        else if (auctionsType == 2) // decreaseAllowance
            data = await erc20_contract.methods.decreaseAllowance(token.sellerAddress, valueSpend).encodeABI();
        else if (auctionsType == 3) // increaseAllowance
            data = await erc20_contract.methods.increaseAllowance(token.sellerAddress, valueSpend).encodeABI();
        else
            throw new Error("Function is not valid");

        const transactionObjectErc20 = {
            from: buyerAddress,
            to: ERC20_CONTRACT_ADDRESS,
            gas: gasLimit,
            gasPrice: await web3.eth.getGasPrice(),
            data: data
        };

        console.log("transactionObjectErc20>", transactionObjectErc20)
        const SignedTransactionER20 = await signature(transactionObjectErc20, privateKeyByAddress.privateKey)
        console.log("SignedTransactionER20>", SignedTransactionER20)

        return SignedTransactionER20.transactionHash
    } catch (err: any) {
        console.log(err)
        throw new Error(err.reason || err.message || "Error to create auctions");
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

export async function finishAuction(sellerAddress: string, buyerAddress: string, bidderHash: string, ownerApprovedHash: string, auctionData: TauctionData): Promise<any> {
    try {
        auctionData.collectionAddress = ERC721_CONTRACT_ADDRESS || ""
        auctionData.erc20Address = ERC20_CONTRACT_ADDRESS || ""
        const block = await web3.eth.getBlock('latest');
        const gasLimit = Math.round(Number(block.gasLimit) / block.transactions.length);
        const privateKeyBySeller = PRIVAVE_KEYS.find((data: any) => data.addres == sellerAddress)
        const privateKeyByBuyer = PRIVAVE_KEYS.find((data: any) => data.addres == buyerAddress)

        const bidderSig = await transactionSignature(bidderHash, privateKeyBySeller.privateKey)
        const ownerApprovedSig = await transactionSignature(ownerApprovedHash, privateKeyBySeller.privateKey)
        const data = await marketplace_contract.methods.finishAuction(auctionData, bidderSig, ownerApprovedSig).encodeABI();
        console.log(auctionData)
        const transactionObjectFinishAuction = {
            from: buyerAddress,
            to: SETTLER_CONTRACT_MARKETPLACE_ADDRESS,
            gas: gasLimit,
            gasPrice: await web3.eth.getGasPrice(),
            data: data
        };
        console.log("transactionObjectFinishAuction>", transactionObjectFinishAuction)

        console.log(auctionData)
        console.log(bidderSig)
        console.log(ownerApprovedSig)

        console.log(bidderHash)
        console.log(ownerApprovedHash)
        const SignedTransactionFinishAuction = await signature(transactionObjectFinishAuction, privateKeyByBuyer.privateKey)
        console.log("SignedTransactionFinishAuction>", SignedTransactionFinishAuction)

        return SignedTransactionFinishAuction.transactionHash
        return 1
    } catch (err: any) {
        console.log(err)
        throw new Error(err.reason || err.message || "Error to buy token");
    }
}

export async function newAuctionsValue(address: string): Promise<any> {
    try {
        return await erc20_contract.methods.allowance(address, address).call()
    } catch (err) {
        throw new Error('Error AuctionsValue');
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

export async function transactionSignature(messageHash: string, privateKey: string): Promise<string> {
    const signedMessage = await web3.eth.accounts.sign(messageHash, privateKey);
    console.log(signedMessage)
    return signedMessage.signature;
}


