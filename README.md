# JC_nft_marketplace

Express Backend that uses Ethers.js to interact with an NFT Marketplace contract


https://www.postman.com/solar-water-714478/workspace/jc-marketplace-nft/overview
## Description:

Create a basic Node.js backend server that maintains a list of listings in memory. This server will offer these listings via a REST API, enabling users to connect, negotiate terms through bidding, and ultimately execute secure trades using the Settler contract.

## Smart contracts

In this project is necessary  use 3 different contracts for the marketplace

[Settler Contract](https://sepolia.etherscan.io/address/0x597c9bc3f00a4df00f85e9334628f6cdf03a1184#code)
[MockERC20](https://sepolia.etherscan.io/address/0xbd65c58d6f46d5c682bf2f36306d461e3561c747#code)
[MockERC721](https://sepolia.etherscan.io/address/0xfce9b92ec11680898c7fe57c4ddcea83aeaba3ff#code)

## Endpoints

[Postman](https://www.postman.com/solar-water-714478/workspace/jc-marketplace-nft/overview)

AUCTIONS
**POST**  - /transactions/auctions
> Do some action in this endpoint is important  the auctionsType
1 => Approve
2 => DecreaseAllowance
3 => IncreaseAllowance

**POST** - /transactions/aprove_transaction
> Approve transaction than the user want, also send the money and token.

 **POST**  - /transactions/buy_token
>  Permit buy a token.

OFFERS
**GET**  - /offers/list_offers
> List all offers existing

**POST**  - /offers/create_offer
> Create new offer


## Installing and running

1. git clone
2. npm i
	1. Configure .env vars you could take example of .env.example
	1. For save the addres information you must use this estructure [{"addres":"","privateKey":""},{}...{}]
3. npm run start


 
## Notes

- The api will run on the port 3000
- In the section endpoint you could find the link to [Postman](https://www.postman.com/solar-water-714478/workspace/jc-marketplace-nft/overview) .
- I also added some testings to check the flow