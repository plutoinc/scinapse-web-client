import { Dispatch } from "react-redux";
import { Paper } from "../../model/paper";
import { PDFViewerState } from "../../reducers/pdfViewer";
import { CurrentUser } from "../../model/currentUser";

export interface PDFViewerProps {
  paper: Paper;
  currentUser: CurrentUser;
  PDFViewerState: PDFViewerState;
  relatedPaperList: Paper[];
  shouldShowRelatedPapers: boolean;
  isLoadingRelatedPaperList: boolean;
  dispatch: Dispatch<any>;
  afterDownloadPDF: () => void;
}
