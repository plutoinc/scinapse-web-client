import { PaperSource } from "../model/paperSource";

export function isPDFLink(source: PaperSource) {
  if (source.isPdf) return true;

  // TODO: Remove below logic after done checking pdf sources
  const url = source.url;
  return (
    url.startsWith("https://arxiv.org/pdf/") ||
    (url.startsWith("http") && url.endsWith(".pdf") && !url.includes("springer"))
  );
}

export function getPDFLink(urls: PaperSource[]): PaperSource | undefined {
  const pdfLink = urls.find(url => url.isPdf);

  if (pdfLink) {
    return pdfLink;
  }

  // TODO: Remove below logic after done checking pdf sources
  return urls.find((paperSource: PaperSource) => {
    return isPDFLink(paperSource);
  });
}
