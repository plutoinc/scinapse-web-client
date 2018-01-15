import { WalletFactory, initialWallet, IWallet } from "../wallet";

describe("Wallet record model", () => {
  let mockWallet: IWallet;

  describe("WalletStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(WalletFactory().toString()).toContain("Record");
      });

      it("should return same value with initial state", () => {
        expect(WalletFactory().toJS()).toEqual(initialWallet);
      });
    });

    describe("when there are params", () => {
      const mockId = 12345;
      const mockAddress = "xfdsfdsfds";

      beforeEach(() => {
        mockWallet = {
          id: mockId,
          address: mockAddress,
        };
      });

      it("should return recoridfied state", () => {
        expect(WalletFactory(mockWallet).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(WalletFactory(mockWallet).toJS()).toEqual(mockWallet);
      });

      it("should return same id with params", () => {
        expect(WalletFactory(mockWallet).id).toEqual(mockId);
      });

      it("should return same address value with params", () => {
        expect(WalletFactory(mockWallet).address).toEqual(mockAddress);
      });
    });
  });
});
