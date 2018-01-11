import { PaperSourceFactory, initialPaperSource, IPaperSource } from "../paperSource";

describe("PaperSource record model", () => {
  let mockPaperSource: IPaperSource;

  describe("PaperSourceStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(PaperSourceFactory().toString()).toContain("Record");
      });

      it("should return same value with initial state", () => {
        expect(PaperSourceFactory().toJS()).toEqual(initialPaperSource);
      });
    });

    describe("when there are params", () => {
      const mockId = 233223;
      const mockPaperId = 233232;
      const mockUrl = "http://dfsfdssd.com";

      beforeEach(() => {
        mockPaperSource = {
          id: mockId,
          paperId: mockPaperId,
          url: mockUrl,
        };
      });

      it("should return recoridfied state", () => {
        expect(PaperSourceFactory(mockPaperSource).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(PaperSourceFactory(mockPaperSource).toJS()).toEqual(mockPaperSource);
      });

      it("should return same id with params", () => {
        expect(PaperSourceFactory(mockPaperSource).id).toEqual(mockId);
      });

      it("should return same paperId value with params", () => {
        expect(PaperSourceFactory(mockPaperSource).paperId).toEqual(mockPaperId);
      });

      it("should return same url value with params", () => {
        expect(PaperSourceFactory(mockPaperSource).url).toEqual(mockUrl);
      });
    });
  });
});
