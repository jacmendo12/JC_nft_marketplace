import { Request, Response } from 'express';

export const createMockRequest = (data: any): Request => {
  return data as Request;
};

export const createMockResponse = (): Response => {
  const res: Partial<Response> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };
  return res as Response;
};
