import { PaperSource } from "../model/paperSource";

export function getPDFLink(urls: PaperSource[]): PaperSource | undefined {
  const pdfSourceRecord =
    urls &&
    urls.find((paperSource: PaperSource) => {
      return (
        paperSource.url.startsWith("https://arxiv.org/pdf/") ||
        (paperSource.url.startsWith("http") && paperSource.url.endsWith(".pdf"))
      );
    });
  return pdfSourceRecord;
}
