import { WalletFactory, initialWallet, IWallet } from "../wallet";

describe("Wallet record model", () => {
  let mockWallet: IWallet;

  describe("WalletStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          WalletFactory()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(WalletFactory().toJS()).toEqual(initialWallet);
      });
    });

    describe("when there are params", () => {
      beforeEach(() => {
        mockWallet = {
          walletId: 12345,
          address: "12345",
        };
      });

      it("should return recoridfied state", () => {
        expect(
          WalletFactory(mockWallet)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with params value", () => {
        expect(WalletFactory(mockWallet).toJS()).toEqual(mockWallet);
      });
    });
  });
});
