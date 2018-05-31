import { AvailableCitationType } from "../paperShow/records";

export interface BookmarkPageState
  extends Readonly<{
      isEnd: boolean;
      hasError: boolean;
      totalPageCount: number;
      currentPage: number;
      isLoading: boolean;
      isCitationDialogOpen: boolean;
      activeCitationTab: AvailableCitationType;
      isFetchingCitationInformation: boolean;
      citationText: string;
      activeCitationDialogPaperId: number;
    }> {}

export const INITIAL_BOOKMARK_PAGE_STATE = {
  isEnd: false,
  hasError: false,
  totalPageCount: 0,
  currentPage: 1,
  isLoading: false,
  isCitationDialogOpen: false,
  activeCitationTab: AvailableCitationType.BIBTEX,
  isFetchingCitationInformation: false,
  citationText: "",
  activeCitationDialogPaperId: 0,
};
