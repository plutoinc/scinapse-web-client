import { Dispatch } from 'redux';
import { CancelToken } from 'axios';
import { ActionCreators } from './actionTypes';
import { Paper, PaperPdf } from '../model/paper';
import PaperAPI from '../api/paper';

export function getBestPdfOfPaper(paper: Paper, cancelToken: CancelToken) {
  return async (dispatch: Dispatch<any>) => {
    const { id, bestPdf } = paper;
    let pdf: PaperPdf | undefined = bestPdf;

    if (!pdf) {
      pdf = await PaperAPI.getBestPdfOfPaper({ paperId: id, cancelToken });
      if (pdf) {
        dispatch(ActionCreators.getBestPDFOfPaper({ paperId: id, bestPDF: pdf }));
      }
    }
  };
}

export async function getPDFPathOrBlob(pdf: PaperPdf, cancelToken: CancelToken) {
  if (!pdf) return null;

  if (pdf.path) return pdf.path;

  if (pdf.hasBest) {
    const blob = await PaperAPI.getPDFBlob(pdf.url, cancelToken);
    return blob;
  }
}
