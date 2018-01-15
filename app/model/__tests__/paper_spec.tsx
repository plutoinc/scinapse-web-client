import { recordifyPaper, initialPaper, IPaper } from "../paper";
import { initialFos, FosFactory } from "../fos";
import { initialAuthor, AuthorFactory } from "../author";
import { initialComment, recordifyComment } from "../comment";
import { initialPaperSource, PaperSourceFactory } from "../paperSource";
import { initialJournal, JournalFactory } from "../journal";

describe("currentUser model", () => {
  describe("PaperStateFactory function", () => {
    it("should return initial state when there is no param", () => {
      expect(recordifyPaper().toJS()).toEqual(initialPaper);
    });

    it("should return recordified state when there is no param", () => {
      expect(recordifyPaper().toString()).toContain("Record");
    });

    describe("when there are params", () => {
      let mockUserObject: IPaper;
      const mockId = 233232;
      const mockTitle = "fdsfds";
      const mockYear = 3232;
      const mockReferenceCount = 2323;
      const mockCitedCount = 2;
      const mockLang = "eng";
      const mockDoi = "fdsfdfdssdf";
      const mockPublisher = "sdfdfssdf";
      const mockVenue = "fsdfdsdfs";
      const mockFosList = [initialFos, initialFos];
      const mockAuthors = [initialAuthor, initialAuthor, initialAuthor];
      const mockAbstract = "dsffdsdfs";
      const mockCommentCount = 2323;
      const mockComments = [initialComment, initialComment];
      const mockUrls = [initialPaperSource, initialPaperSource, initialPaperSource];
      const mockJournal = initialJournal;

      beforeEach(() => {
        mockUserObject = {
          id: mockId,
          title: mockTitle,
          year: mockYear,
          referenceCount: mockReferenceCount,
          citedCount: mockCitedCount,
          lang: mockLang,
          doi: mockDoi,
          publisher: mockPublisher,
          venue: mockVenue,
          fosList: mockFosList,
          authors: mockAuthors,
          abstract: mockAbstract,
          commentCount: mockCommentCount,
          comments: mockComments,
          urls: mockUrls,
          journal: mockJournal,
        };
      });

      it("should return recordified state", () => {
        expect(recordifyPaper(mockUserObject).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(recordifyPaper(mockUserObject).toJS()).toEqual(mockUserObject);
      });

      it("should return same id with params", () => {
        expect(recordifyPaper(mockUserObject).id).toEqual(mockId);
      });

      it("should return same title with params", () => {
        expect(recordifyPaper(mockUserObject).title).toEqual(mockTitle);
      });

      it("should return same year value with params", () => {
        expect(recordifyPaper(mockUserObject).year).toEqual(mockYear);
      });

      it("should return same referenceCount value with params", () => {
        expect(recordifyPaper(mockUserObject).referenceCount).toEqual(mockReferenceCount);
      });

      it("should return same citedCount with params", () => {
        expect(recordifyPaper(mockUserObject).citedCount).toEqual(mockCitedCount);
      });

      it("should return same lang with params", () => {
        expect(recordifyPaper(mockUserObject).lang).toEqual(mockLang);
      });

      it("should return same doi with params", () => {
        expect(recordifyPaper(mockUserObject).doi).toEqual(mockDoi);
      });

      it("should return same publisher with params", () => {
        expect(recordifyPaper(mockUserObject).publisher).toEqual(mockPublisher);
      });

      it("should return same venue with params", () => {
        expect(recordifyPaper(mockUserObject).venue).toEqual(mockVenue);
      });

      it("should return recorded fosList with params", () => {
        expect(recordifyPaper(mockUserObject).fosList.get(0)).toEqual(FosFactory(initialFos));
      });

      it("should return recorded authors with params", () => {
        expect(recordifyPaper(mockUserObject).authors.get(0)).toEqual(AuthorFactory(initialAuthor));
      });

      it("should return same abstract with params", () => {
        expect(recordifyPaper(mockUserObject).abstract).toEqual(mockAbstract);
      });

      it("should return same commentCount with params", () => {
        expect(recordifyPaper(mockUserObject).commentCount).toEqual(mockCommentCount);
      });

      it("should return recorded comments with params", () => {
        expect(JSON.stringify(recordifyPaper(mockUserObject).comments.get(0))).toEqual(
          JSON.stringify(recordifyComment(initialComment)),
        );
      });

      it("should return recorded urls with params", () => {
        expect(recordifyPaper(mockUserObject).urls.get(0)).toEqual(PaperSourceFactory(initialPaperSource));
      });

      it("should return recorded journal with params", () => {
        expect(recordifyPaper(mockUserObject).journal).toEqual(JournalFactory(mockJournal));
      });
    });
  });
});
