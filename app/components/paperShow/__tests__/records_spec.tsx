jest.unmock("../records");

import { PaperShowStateFactory, initialPaperShowState, PaperShowState, AvailableCitationType } from "../records";
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

      it.skip("should return object that has same values with initial state", () => {
        expect(state.toJS()).toEqual(initialPaperShowState);
      });
    });

    describe("when there is parameters", () => {
      beforeEach(() => {
        const mockState: PaperShowState = {
          isAuthorBoxExtended: false,
          isLoadingPaper: true,
          hasErrorOnFetchingPaper: true,
          paperId: 0,
          isLoadingComments: true,
          hasErrorOnFetchingComments: true,
          currentCommentPage: 1,
          commentTotalPage: 1,
          comments: [RAW.COMMENT],
          commentInput: "mockComment",
          isCitationDialogOpen: false,
          isDeletingComment: false,
          isPostingComment: false,
          isFailedToPostingComment: false,
          referencePaperIds: [123],
          isLoadingReferencePapers: false,
          isFailedToGetReferencePapers: false,
          referencePaperTotalPage: 1,
          referencePaperCurrentPage: 1,
          citedPaperIds: [123],
          relatedPaperIds: [123],
          otherPaperIds: [123],
          isLoadingCitedPapers: false,
          isFailedToGetCitedPapers: false,
          citedPaperTotalPage: 0,
          citedPaperCurrentPage: 0,

          activeCitationTab: AvailableCitationType.BIBTEX,
          isFetchingCitationInformation: false,
          citationText: "",
          isBookmarked: false,
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

      it("should return referencePapers data with recordified value", () => {
        expect(state.referencePapers.toString().slice(0, 6)).toContain("List");
      });
    });
  });
});
