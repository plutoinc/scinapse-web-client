import { Paper } from '../../model/paper';

export interface PDFViewerProps {
  paper: Paper;
  afterDownloadPDF: () => void;
}
