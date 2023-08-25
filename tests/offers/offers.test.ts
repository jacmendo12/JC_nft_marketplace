import { createOffer, list_offers } from '../../src/modules/offers/offers.Service';
import { mockOffersList } from '../moks/mockData'; // Importa el mockOffersList
import { createMockRequest, createMockResponse } from './mocks';
import {
  offersTypes,
} from "../../src/shared/persistence/offer.persistence";
import * as blockchain from '../../src/shared/utils/blockchain';
import { buyOfferSchema } from '../../src/modules/offers/dto/offers.dto';
import { Request } from 'express';
import { error } from 'console';

declare module 'express' {
  interface Request {
    offersList?: any[]; // Ajusta el tipo según tus necesidades
  }
}

describe('list_offers', () => {
  it('should respond with offers list', async () => {
    const mockRequest = createMockRequest({ offersList: mockOffersList });
    const mockResponse = createMockResponse();
    await list_offers(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: mockOffersList });
  });
});



describe('createOffer', () => {

  it('token is not of user', async () => {
    const mockReqBody = {
      sellerAddress: '0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9',
      tokenID: 171,
      value: 1000,
      offerType: offersTypes.Buy
    };

    const mockReq = createMockRequest({ body: mockReqBody });
    mockReq.offersList = mockOffersList;
    const mockRes = createMockResponse();

    const blockchainHaveTokenMock = jest.spyOn(blockchain, 'haveToken');
    blockchainHaveTokenMock.mockRejectedValue(new Error("error"));

    await createOffer(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });

  it('should create a new offer', async () => {
    const mockReqBody = {
      sellerAddress: '0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9',
      tokenID: 171,
      value: 1000,
      offerType: offersTypes.Buy
    };

    const mockReq = createMockRequest({ body: mockReqBody });
    mockReq.offersList = mockOffersList;
    const mockRes = createMockResponse();

    const blockchainHaveTokenMock = jest.spyOn(blockchain, 'haveToken');
    blockchainHaveTokenMock.mockResolvedValueOnce("ok"); // Resuelve con éxito

    await createOffer(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'successful',
      data: expect.objectContaining({
        id: expect.any(String),
        status: 'Pending',
        buyerAddress: [],
        sellerAddress: mockReqBody.sellerAddress,
        tokenID: mockReqBody.tokenID,
        value: mockReqBody.value,
        offerType: mockReqBody.offerType
      })
    });
  });

  it('failed data wrong', async () => {
    const mockReqBody = {
      sellerAddress: '0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9',
    };

    const mockReq = createMockRequest({ body: mockReqBody });
    mockReq.offersList = mockOffersList;
    const mockRes = createMockResponse();

    const blockchainHaveTokenMock = jest.spyOn(blockchain, 'haveToken');
    blockchainHaveTokenMock.mockResolvedValueOnce("ok"); // Resuelve con éxito

    await createOffer(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(400);
  });
});
