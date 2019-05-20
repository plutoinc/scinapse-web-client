import { Dispatch } from "react-redux";
import { Paper, PaperPdf } from "../../model/paper";
import { PaperSource } from "../../model/paperSource";

export interface PDFViewerProps {
  relatedPaperList: Paper[];
  isLoggedIn: boolean;
  isRelatedPaperLoading: boolean;
  shouldShowRelatedPapers: boolean;
  dispatch: Dispatch<any>;
  paperId: number;
  shouldShow: boolean;
  filename: string;
  sources: PaperSource[];
  bestPdf?: PaperPdf;
  isDownloadedPDF: boolean;
  handleSetScrollAfterDownload: () => void;
  handleSetIsDownloadedPDF: (isDownload: boolean) => void;
  handleGetBestPdf: () => Promise<PaperPdf> | undefined;
  onLoadSuccess: () => void;
  onFailed: () => void;
}
