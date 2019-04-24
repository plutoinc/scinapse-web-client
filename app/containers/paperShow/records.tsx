export enum AvailableCitationType {
  BIBTEX,
  RIS,
  APA,
  MLA,
  IEEE,
  HARVARD,
  VANCOUVER,
  CHICAGO,
}

export interface PaperShowState
  extends Readonly<{
      isAuthorBoxExtended: boolean;
      isLoadingPaper: boolean;
      hasErrorOnFetchingPaper: number | null;
      isLoadingComments: boolean;
      hasErrorOnFetchingComments: boolean;
      currentCommentPage: number;
      commentTotalPage: number;
      paperId: number;
      isDeletingComment: boolean;
      isPostingComment: boolean;
      isFailedToPostingComment: boolean;

      relatedPaperIds: number[];
      otherPaperIdsFromAuthor: number[];
      referencePaperIds: number[];
      citedPaperIds: number[];
      commentIds: number[];

      hasFailedToLoadMyCollections: boolean;
      hasFailedToPositingNewCollection: boolean;

      isLoadingReferencePapers: boolean;
      isFailedToGetReferencePapers: boolean;
      referencePaperTotalPage: number;
      referencePaperCurrentPage: number;
      isLoadingCitedPapers: boolean;
      isFailedToGetCitedPapers: boolean;
      citedPaperTotalPage: number;
      citedPaperCurrentPage: number;

      isFetchingPdf: boolean;
      isOACheckingPDF: boolean;

      betterSearchIsAnimated: boolean;
    }> {}

export const PAPER_SHOW_INITIAL_STATE: PaperShowState = {
  isAuthorBoxExtended: false,
  isLoadingPaper: false,
  hasErrorOnFetchingPaper: null,
  paperId: 0,
  isLoadingComments: false,
  hasErrorOnFetchingComments: false,
  currentCommentPage: 0,
  commentTotalPage: 0,
  commentIds: [],
  isDeletingComment: false,
  isPostingComment: false,
  isFailedToPostingComment: false,

  relatedPaperIds: [],
  otherPaperIdsFromAuthor: [],

  hasFailedToLoadMyCollections: false,
  hasFailedToPositingNewCollection: false,

  referencePaperIds: [],
  isLoadingReferencePapers: false,
  isFailedToGetReferencePapers: false,
  referencePaperTotalPage: 0,
  referencePaperCurrentPage: 0,

  citedPaperIds: [],
  isLoadingCitedPapers: false,
  isFailedToGetCitedPapers: false,
  citedPaperTotalPage: 0,
  citedPaperCurrentPage: 0,

  isFetchingPdf: false,
  isOACheckingPDF: false,

  betterSearchIsAnimated: false,
};
