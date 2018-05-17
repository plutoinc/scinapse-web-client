import { PaperAuthorFactory, initialPaperAuthor, PaperAuthor } from "../author";
import { initialAffiliation } from "../affiliation";

describe("Author record model", () => {
  let mockAuthor: PaperAuthor;

  describe("AuthorStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(PaperAuthorFactory().toString()).toContain("Record");
      });

      it("should return same value with initial state", () => {
        expect(PaperAuthorFactory().toJS()).toEqual(initialPaperAuthor);
      });
    });

    describe("when there are params", () => {
      const mockId = 324234;
      const mockOrder = 12345;
      const mockName = "testjh";
      const mockOrganization = "postech";
      const mockHIndex = 23232;

      beforeEach(() => {
        mockAuthor = {
          order: mockOrder,
          name: mockName,
          organization: mockOrganization,
          hindex: mockHIndex,
          id: mockId,
          affiliation: initialAffiliation,
        };
      });

      it("should return recoridfied state", () => {
        expect(PaperAuthorFactory(mockAuthor).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(PaperAuthorFactory(mockAuthor).toJS()).toEqual(mockAuthor);
      });

      it("should return same order with params", () => {
        expect(PaperAuthorFactory(mockAuthor).order).toEqual(mockOrder);
      });

      it("should return same name value with params", () => {
        expect(PaperAuthorFactory(mockAuthor).name).toEqual(mockName);
      });

      it("should return same organization value with params", () => {
        expect(PaperAuthorFactory(mockAuthor).organization).toEqual(mockOrganization);
      });

      it("should return same hIndex value with params", () => {
        expect(PaperAuthorFactory(mockAuthor).hindex).toEqual(mockHIndex);
      });
    });
  });
});
