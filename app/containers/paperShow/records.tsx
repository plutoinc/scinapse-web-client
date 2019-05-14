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

      paperId: number;
      referencePaperIds: number[];
      citedPaperIds: number[];

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

      highlightTitle: string;
      highlightAbstract: string;
    }> {}

export const PAPER_SHOW_INITIAL_STATE: PaperShowState = {
  isAuthorBoxExtended: false,
  isLoadingPaper: false,
  hasErrorOnFetchingPaper: null,

  hasFailedToLoadMyCollections: false,
  hasFailedToPositingNewCollection: false,

  paperId: 0,
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

  highlightTitle: "",
  highlightAbstract: "",
};
