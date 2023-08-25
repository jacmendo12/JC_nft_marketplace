import { Request, Response } from "express";
import { Toffer, OfferStatus, offersTypes } from "../../src/shared/persistence/offer.persistence";
import * as blockchain from '../../src/shared/utils/blockchain';
import * as readContract from '../../src/shared/utils/readContract';

import { auctions } from "../../src/modules/transactions/transactions.Service"; // Asegúrate de importar correctamente la función auctions

declare module 'express' {
    interface Request {
      offersList?: any[]; // Ajusta el tipo según tus necesidades
    }
  }

describe("auctions", () => {
    const mockReq: Partial<Request> = {}; // Crear un mock de Request
    const mockRes: Partial<Response> = {}; // Crear un mock de Response

    beforeEach(() => {
        mockReq.offersList = [
            {
                id: "ad59246f-5213-4303-8f29-e1cfe3a582ef",
                status: OfferStatus.Pending,
                buyerData: [
                    {
                        uuid: "2c5bce81-c193-4975-98bd-58029ff5202f",
                        auctionsHash: "0xfcfa46ff6cce913036582e8eab9b33572472b9801b89e2e92ccffb11355679e1",
                        auctionsValue: 2000,
                        newAuctionsValue: "1001",
                        buyerAddress: "0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9",
                        status: OfferStatus.Pending
                    }
                ],
                sellerAddress: "0xe7D4Adf8ef90D2A2B5A325d02d4877533A297741",
                tokenID: 172,
                value: 1000,
                offerType: offersTypes.Auctions
            }
        ];
        mockRes.status = jest.fn().mockReturnValue(mockRes);
        mockRes.json = jest.fn();
    });

    it("error", async () => {
        const blockchainHaveTokenMock = jest.spyOn(readContract, 'getBalanceERC20');
        blockchainHaveTokenMock.mockResolvedValueOnce(1000);

        const mockValidateFound = jest.spyOn(readContract, 'validateFound');
        mockValidateFound.mockResolvedValueOnce(undefined);

        const mockAuctions = jest.spyOn(blockchain, 'auctions');
        mockAuctions.mockResolvedValueOnce("0x123232334test123");

        const mockNewAuctionsValue = jest.spyOn(blockchain, 'auctions');
        mockNewAuctionsValue.mockResolvedValueOnce("2000");

        // // call function auctions
        await auctions(mockReq as Request, mockRes as Response);
        expect(mockRes.status).toHaveBeenCalledWith(400);
      
    });

});
