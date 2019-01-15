import { PaperSource } from "../model/paperSource";

export function getPDFLink(urls: PaperSource[]): PaperSource | undefined {
  return (
    urls &&
    urls.find((paperSource: PaperSource) => {
      return isPDFLink(paperSource.url);
    })
  );
}

export function isPDFLink(url: string) {
  return url.startsWith("https://arxiv.org/pdf/") || (url.startsWith("http") && url.endsWith(".pdf"));
}
