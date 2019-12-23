import { Paper, PaperPdf } from '../model/paper';
import PaperAPI from '../api/paper';

export async function getBestPdf(paper: Paper) {
  if (paper.bestPdf) return paper.bestPdf;
  return await PaperAPI.getBestPdfOfPaper({ paperId: paper.id });
}

export async function getPDFPathOrBlob(pdf: PaperPdf) {
  if (!pdf) return null;

  if (pdf.path) return pdf.path;

  if (pdf.hasBest) {
    const blob = await PaperAPI.getPDFBlob(pdf.url);
    return blob;
  }
}
