import { list_offers } from '../../src/modules/offers/offers.Service';
import { mockOffersList } from '../moks/mockData'; // Importa el mockOffersList
import { createMockRequest, createMockResponse } from './mocks';

describe('list_offers', () => {
    it('should respond with offers list', async () => {
        const mockRequest = createMockRequest({ offersList: mockOffersList });
        const mockResponse = createMockResponse();
       await list_offers(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: mockOffersList });
      });
 
});

 