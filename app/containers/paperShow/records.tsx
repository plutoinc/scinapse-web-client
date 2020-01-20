export enum AvailableCitationType {
  BIBTEX,
  RIS,
  APA,
  MLA,
  IEEE,
  HARVARD,
  VANCOUVER,
  CHICAGO,
  ACS,
}

export enum AvailableExportCitationType {
  BIBTEX,
  RIS,
}

export interface PaperShowState
  extends Readonly<{
      isAuthorBoxExtended: boolean;
      isLoadingPaper: boolean;
      errorStatusCode: number | null;

      paperId: string;
      referencePaperIds: string[];
      citedPaperIds: string[];

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

      highlightTitle: string;
      highlightAbstract: string;
    }> {}

export const PAPER_SHOW_INITIAL_STATE: PaperShowState = {
  isAuthorBoxExtended: false,
  isLoadingPaper: false,
  errorStatusCode: null,

  hasFailedToLoadMyCollections: false,
  hasFailedToPositingNewCollection: false,

  paperId: '',
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

  highlightTitle: '',
  highlightAbstract: '',
};
