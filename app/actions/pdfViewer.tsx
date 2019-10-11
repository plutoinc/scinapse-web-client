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
