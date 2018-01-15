import { JournalFactory, initialJournal, IJournal } from "../journal";

describe("Journal record model", () => {
  let mockJournal: IJournal;

  describe("JournalStateFactory", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(JournalFactory().toString()).toContain("Record");
      });

      it("should return same value with initial state", () => {
        expect(JournalFactory().toJS()).toEqual(initialJournal);
      });
    });

    describe("when there are params", () => {
      const mockId = 12345;
      const mockImpactFactor = 23;
      const mockFullTitle = "postech";

      beforeEach(() => {
        mockJournal = {
          id: mockId,
          impactFactor: mockImpactFactor,
          fullTitle: mockFullTitle,
        };
      });

      it("should return recoridfied state", () => {
        expect(JournalFactory(mockJournal).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(JournalFactory(mockJournal).toJS()).toEqual(mockJournal);
      });

      it("should return same id with params", () => {
        expect(JournalFactory(mockJournal).id).toEqual(mockId);
      });

      it("should return same impactFactor value with params", () => {
        expect(JournalFactory(mockJournal).impactFactor).toEqual(mockImpactFactor);
      });

      it("should return same fullTitle value with params", () => {
        expect(JournalFactory(mockJournal).fullTitle).toEqual(mockFullTitle);
      });
    });
  });
});
