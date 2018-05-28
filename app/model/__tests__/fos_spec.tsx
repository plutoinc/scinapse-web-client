import { FosFactory, initialFos, Fos } from "../fos";

describe("Fos record model", () => {
  let mockFos: Fos;

  describe("FosStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(FosFactory().toString()).toContain("Record");
      });

      it("should return same value with initial state", () => {
        expect(FosFactory().toJS()).toEqual(initialFos);
      });
    });

    describe("when there are params", () => {
      const mockId = 12345;
      const mockFosContent = "AI";

      beforeEach(() => {
        mockFos = {
          id: mockId,
          fos: mockFosContent,
        };
      });

      it("should return recoridfied state", () => {
        expect(FosFactory(mockFos).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(FosFactory(mockFos).toJS()).toEqual(mockFos);
      });

      it("should return same id with params", () => {
        expect(FosFactory(mockFos).id).toEqual(mockId);
      });

      it("should return same fos value with params", () => {
        expect(FosFactory(mockFos).fos).toEqual(mockFosContent);
      });
    });
  });
});
