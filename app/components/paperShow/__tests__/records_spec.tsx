jest.unmock("../records");

import { PaperShowStateFactory, initialPaperShowState, PaperShowState } from "../records";
import { RAW } from "../../../__mocks__";

describe("paperShowState Immutable Record logics", () => {
  describe("PaperShowStateFactory function", () => {
    let state: any;

    describe("when there isn't any parameters", () => {
      beforeEach(() => {
        state = PaperShowStateFactory();
      });

      it("should return recordified type's initial state", () => {
        expect(state.toString().slice(0, 6)).toContain("Record");
      });

      it("should return object that has same values with initial state", () => {
        expect(state.toJS()).toEqual(initialPaperShowState);
      });
    });

    describe("when there is parameters", () => {
      beforeEach(() => {
        const mockPaper = RAW.PAPER;
        const mockState: PaperShowState = {
          isLoadingPaper: true,
          hasErrorOnFetchingPaper: true,
          paper: mockPaper,
          isLoadingComments: true,
          hasErrorOnFetchingComments: true,
          currentCommentPage: 1,
          commentTotalPage: 1,
          comments: [RAW.COMMENT],
          commentInput: "mockComment",
          isDeletingComment: false,
          isPostingComment: false,
          isFailedToPostingComment: false,
          relatedPapers: [RAW.PAPER],
          isLoadingRelatedPapers: false,
          isFailedToGetRelatedPapers: false,
          relatedPaperTotalPage: 1,
          relatedPaperCurrentPage: 1,
          relatedPapersMeta: [
            {
              paperId: 0,
              isAbstractOpen: false,
              isAuthorsOpen: false,
              isFirstOpen: false,
              isTitleVisited: false,
            },
          ],
        };
        state = PaperShowStateFactory(mockState);
      });

      it("should return recordified type's initial state", () => {
        expect(state.toString().slice(0, 6)).toContain("Record");
      });

      it("should return paper attribute with recordified value", () => {
        expect(state.paper.toString().slice(0, 6)).toContain("Record");
      });

      it("should return comments attribute with recordified value", () => {
        expect(state.comments.toString().slice(0, 6)).toContain("List");
      });

      it("should return relatedPapers data with recordified value", () => {
        expect(state.relatedPapers.toString().slice(0, 6)).toContain("List");
      });
    });
  });
});
