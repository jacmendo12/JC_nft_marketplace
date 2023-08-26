import { Toffer, OfferStatus, offersTypes } from "../../src/shared/persistence/offer.persistence";
import * as readContract from '../../src/shared/utils/readContract';

describe("readContract", () => {

    it("newAuctionsValue", async () => {
        const mockCall = jest.fn().mockResolvedValue("2000");
        const mockErc20Contract = {
          methods: {
            allowance: jest.fn(() => ({ call: mockCall }))
          }
        };
        // Llamar a la función newAuctionsValue
        const result = await readContract.newAuctionsValue("0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9");
        expect(result).toBe(1001n);
    });

    it("newAuctionsValue > wrong addres", async () => {
        const mockCall = jest.fn().mockResolvedValue("2000");
        // Llamar a la función newAuctionsValue
        const t = () => {
            throw new TypeError("Error AuctionsValue");
        };
        try {
            const result = await readContract.newAuctionsValue("0x2B4");
        } catch (error) {
            expect(t).toThrow(TypeError);
        }
    });

    it("getBalanceERC20", async () => {
        const mockCall = jest.fn().mockResolvedValue("2000");
        const mockErc20Contract = {
          methods: {
            allowance: jest.fn(() => ({ call: mockCall }))
          }
        };
        // Llamar a la función newAuctionsValue
        const result = await readContract.getBalanceERC20("0x2B4BB6B8512Ae5363F03DB53Fd20CC7C464168C9");
        expect(result).toBe(1000999993000n);
    });
    it("validateFound", async () => {
        const mockCall = jest.fn().mockResolvedValue("2000");
        const mockErc20Contract = {
          methods: {
            allowance: jest.fn(() => ({ call: mockCall }))
          }
        };
        
        const t = () => {
            throw new TypeError("You not have funds for this token");
        };
        try {
            const result = await readContract.validateFound(30,10);
        } catch (error) {
            expect(t).toThrow(TypeError);
        }
    });
    
});