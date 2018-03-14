import { AuthorFactory, initialAuthor, IAuthor } from "../author";

describe("Author record model", () => {
  let mockAuthor: IAuthor;

  describe("AuthorStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(AuthorFactory().toString()).toContain("Record");
      });

      it("should return same value with initial state", () => {
        expect(AuthorFactory().toJS()).toEqual(initialAuthor);
      });
    });

    describe("when there are params", () => {
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
        };
      });

      it("should return recoridfied state", () => {
        expect(AuthorFactory(mockAuthor).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(AuthorFactory(mockAuthor).toJS()).toEqual(mockAuthor);
      });

      it("should return same order with params", () => {
        expect(AuthorFactory(mockAuthor).order).toEqual(mockOrder);
      });

      it("should return same name value with params", () => {
        expect(AuthorFactory(mockAuthor).name).toEqual(mockName);
      });

      it("should return same organization value with params", () => {
        expect(AuthorFactory(mockAuthor).organization).toEqual(mockOrganization);
      });

      it("should return same hIndex value with params", () => {
        expect(AuthorFactory(mockAuthor).hindex).toEqual(mockHIndex);
      });
    });
  });
});
