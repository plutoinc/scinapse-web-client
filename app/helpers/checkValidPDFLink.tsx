import { Paper } from "../model/paper";
import { PaperSource } from "../model/paperSource";

export function checkValidPDFLink(paper: Paper): PaperSource | undefined {
  const pdfSourceRecord =
    paper.urls &&
    paper.urls.find((paperSource: PaperSource) => {
      return (
        paperSource.url.startsWith("https://arxiv.org/pdf/") ||
        (paperSource.url.startsWith("http") && paperSource.url.endsWith(".pdf"))
      );
    });
  return pdfSourceRecord;
}
