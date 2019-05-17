import { Paper } from "../../../model/paper";

export interface PaperShowRefCitedTabProps {
  paper: Paper;
  isLoadingOaCheck: boolean;
  isFixed: boolean;
  isOnRef: boolean;
  isOnCited: boolean;
  isOnFullText: boolean;
  hasFullText: boolean;
  handleClickRefTab: () => void;
  handleClickCitedTab: () => void;
  handleClickFullTextTab?: () => void;
  handleDownloadPdf?: (isDownload: boolean) => void;
}

export interface TabItemProps {
  active: boolean;
  text: string;
  onClick: () => void;
}

export interface PDFButtonProps {
  paper: Paper;
  hasPDF: boolean;
  isLoadingOaCheck: boolean;
  handleDownloadPdf: (isDownload: boolean) => void;
}
