import { PaperFactory, initialPaper, Paper } from "../paper";
import { initialFos, FosFactory } from "../fos";
import { initialPaperAuthor, PaperAuthorFactory } from "../author";
import { initialComment, recordifyComment } from "../comment";
import { initialPaperSource, PaperSourceFactory } from "../paperSource";
import { initialJournal, JournalFactory } from "../journal";

describe("currentUser model", () => {
  describe("PaperStateFactory function", () => {
    it("should return initial state when there is no param", () => {
      expect(PaperFactory()!.toJS()).toEqual(initialPaper);
    });

    it("should return recordified state when there is no param", () => {
      expect(PaperFactory()!.toString()).toContain("Record");
    });

    describe("when there are params", () => {
      let mockPaperObject: Paper;
      const mockId = 233232;
      const mockCognitivePaperId = 123;
      const mockTitle = "fdsfds";
      const mockYear = 3232;
      const mockReferenceCount = 2323;
      const mockCitedCount = 2;
      const mockLang = "eng";
      const mockDoi = "fdsfdfdssdf";
      const mockPublisher = "sdfdfssdf";
      const mockVenue = "fsdfdsdfs";
      const mockFosList = [initialFos, initialFos];
      const mockAuthors = [initialPaperAuthor, initialPaperAuthor, initialPaperAuthor];
      const mockAbstract = "dsffdsdfs";
      const mockCommentCount = 2323;
      const mockComments = [initialComment, initialComment];
      const mockUrls = [initialPaperSource, initialPaperSource, initialPaperSource];
      const mockJournal = initialJournal;

      beforeEach(() => {
        mockPaperObject = {
          id: mockId,
          cognitivePaperId: mockCognitivePaperId,
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
        expect(PaperFactory(mockPaperObject)!.toString()).toContain("Record");
      });

      it.skip("should return same value with params value", () => {
        expect(PaperFactory(mockPaperObject)!.toJS()).toEqual(mockPaperObject);
      });

      it("should return same id with params", () => {
        expect(PaperFactory(mockPaperObject)!.id).toEqual(mockId);
      });

      it("should return same cognitivePaperId with params", () => {
        expect(PaperFactory(mockPaperObject)!.cognitivePaperId).toEqual(mockCognitivePaperId);
      });

      it("should return same title with params", () => {
        expect(PaperFactory(mockPaperObject)!.title).toEqual(mockTitle);
      });

      it("should return same year value with params", () => {
        expect(PaperFactory(mockPaperObject)!.year).toEqual(mockYear);
      });

      it("should return same referenceCount value with params", () => {
        expect(PaperFactory(mockPaperObject)!.referenceCount).toEqual(mockReferenceCount);
      });

      it("should return same citedCount with params", () => {
        expect(PaperFactory(mockPaperObject)!.citedCount).toEqual(mockCitedCount);
      });

      it("should return same lang with params", () => {
        expect(PaperFactory(mockPaperObject)!.lang).toEqual(mockLang);
      });

      it("should return same doi with params", () => {
        expect(PaperFactory(mockPaperObject)!.doi).toEqual(mockDoi);
      });

      it("should return same publisher with params", () => {
        expect(PaperFactory(mockPaperObject)!.publisher).toEqual(mockPublisher);
      });

      it("should return same venue with params", () => {
        expect(PaperFactory(mockPaperObject)!.venue).toEqual(mockVenue);
      });

      it("should return recorded fosList with params", () => {
        expect(PaperFactory(mockPaperObject)!.fosList.get(0)).toEqual(FosFactory(initialFos));
      });

      it("should return recorded authors with params", () => {
        expect(
          PaperFactory(mockPaperObject)!
            .authors.get(0)!
            .toJS(),
        ).toEqual(PaperAuthorFactory(initialPaperAuthor).toJS());
      });

      it("should return same abstract with params", () => {
        expect(PaperFactory(mockPaperObject)!.abstract).toEqual(mockAbstract);
      });

      it("should return same commentCount with params", () => {
        expect(PaperFactory(mockPaperObject)!.commentCount).toEqual(mockCommentCount);
      });

      it("should return recorded comments with params", () => {
        expect(JSON.stringify(PaperFactory(mockPaperObject)!.comments.get(0))).toEqual(
          JSON.stringify(recordifyComment(initialComment)),
        );
      });

      it("should return recorded urls with params", () => {
        expect(PaperFactory(mockPaperObject)!.urls.get(0)).toEqual(PaperSourceFactory(initialPaperSource));
      });

      it("should return recorded journal with params", () => {
        expect(PaperFactory(mockPaperObject)!.journal).toEqual(JournalFactory(mockJournal));
      });
    });
  });
});
