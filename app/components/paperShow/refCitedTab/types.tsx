import { Paper } from "../../../model/paper";

export interface PaperShowRefCitedTabProps extends PDFButtonProps {
  isFixed: boolean;
  isOnRef: boolean;
  isOnCited: boolean;
  isOnFullText: boolean;
  isLoading: boolean;

  handleClickRefTab: () => void;
  handleClickCitedTab: () => void;
  onClickFullTextTab?: () => void;
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
  handleSetIsOpenBlockedPopper: (value: React.SetStateAction<boolean>) => void;
  handleCloseBlockedPopper: () => void;
  afterDownloadPDF: () => void;
  onClickDownloadPDF: () => void;
}
