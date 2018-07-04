export enum AvailableCitationType {
  BIBTEX,
  RIS,
  APA,
  MLA,
  IEEE,
  HARVARD,
  VANCOUVER,
  CHICAGO
}

export interface PaperShowState
  extends Readonly<{
      isAuthorBoxExtended: boolean;
      isLoadingPaper: boolean;
      hasErrorOnFetchingPaper: boolean;
      isLoadingComments: boolean;
      hasErrorOnFetchingComments: boolean;
      currentCommentPage: number;
      commentTotalPage: number;
      paperId: number;
      isCitationDialogOpen: boolean;
      isDeletingComment: boolean;
      isPostingComment: boolean;
      isFailedToPostingComment: boolean;

      relatedPaperIds: number[];
      otherPaperIds: number[];
      referencePaperIds: number[];
      citedPaperIds: number[];
      commentIds: number[];

      isLoadingMyCollections: boolean;
      hasFailedToLoadMyCollections: boolean;
      isPositingNewCollection: boolean;
      hasFailedToPositingNewCollection: boolean;
      myCollectionIds: number[];

      isLoadingReferencePapers: boolean;
      isFailedToGetReferencePapers: boolean;
      referencePaperTotalPage: number;
      referencePaperCurrentPage: number;
      isLoadingCitedPapers: boolean;
      isFailedToGetCitedPapers: boolean;
      citedPaperTotalPage: number;
      citedPaperCurrentPage: number;
      activeCitationTab: AvailableCitationType;
      isFetchingCitationInformation: boolean;
      citationText: string;
      isBookmarked: boolean;
    }> {}

export const PAPER_SHOW_INITIAL_STATE: PaperShowState = {
  isAuthorBoxExtended: false,
  isLoadingPaper: false,
  hasErrorOnFetchingPaper: false,
  paperId: 0,
  isLoadingComments: false,
  hasErrorOnFetchingComments: false,
  currentCommentPage: 0,
  commentTotalPage: 0,
  commentIds: [],
  isCitationDialogOpen: false,
  isDeletingComment: false,
  isPostingComment: false,
  isFailedToPostingComment: false,

  relatedPaperIds: [],
  otherPaperIds: [],

  isLoadingMyCollections: false,
  hasFailedToLoadMyCollections: false,
  isPositingNewCollection: false,
  hasFailedToPositingNewCollection: false,
  myCollectionIds: [],

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

  activeCitationTab: AvailableCitationType.BIBTEX,
  isFetchingCitationInformation: false,
  citationText: "",
  isBookmarked: false
};
