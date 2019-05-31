import { Paper } from '../../../model/paper';
import { CurrentUser } from '../../../model/currentUser';
import { RefCitedTabItem } from '../../../containers/paperShow/types';

export interface PaperShowRefCitedTabProps {
  paper: Paper;
  isFixed: boolean;
  isOnRef: boolean;
  isOnCited: boolean;
  isOnFullText: boolean;
  isLoading: boolean;
  currentUser: CurrentUser;
  canShowFullPDF: boolean;

  afterDownloadPDF: () => void;
  onClickDownloadPDF: () => void;
  onClickTabItem: (section: RefCitedTabItem) => () => void;
}

export interface TabItemProps {
  active: boolean;
  text: string;
  onClick: () => void;
}

export interface PDFButtonProps {
  paper: Paper;
  isLoading: boolean;
  canShowFullPDF: boolean;
  actionBtnEl: HTMLDivElement | null;
  isOpenBlockedPopper: boolean;
  currentUser: CurrentUser;
  afterDownloadPDF: () => void;
  onClickDownloadPDF: () => void;
  handleSetIsOpenBlockedPopper: (value: React.SetStateAction<boolean>) => void;
  handleCloseBlockedPopper: () => void;
}
