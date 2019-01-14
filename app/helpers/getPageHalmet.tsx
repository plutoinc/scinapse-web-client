import * as React from "react";
import { Helmet } from "react-helmet";
import { Paper } from "../model/paper";
import { PaperSource } from "../model/paperSource";

export function getPageHelmet(paper: Paper, structureData: any, buildDescription: string) {
  if (paper) {
    const pdfSourceRecord =
      paper.urls &&
      paper.urls.find((paperSource: PaperSource) => {
        return (
          paperSource.url.startsWith("https://arxiv.org/pdf/") ||
          (paperSource.url.startsWith("http") && paperSource.url.endsWith(".pdf"))
        );
      });

    const metaTitleContent = pdfSourceRecord ? "[PDF] " + paper.title : paper.title;
    const fosListContent =
      paper.fosList && typeof paper.fosList !== "undefined"
        ? paper.fosList
            .map(fos => {
              return fos.fos;
            })
            .toString()
            .replace(/,/gi, ", ")
        : "";

    return (
      <Helmet>
        <title>{metaTitleContent} | Scinapse | Academic search engine for paper}</title>
        <meta itemProp="name" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
        <meta name="description" content={buildDescription} />
        <meta name="keyword" content={fosListContent} />
        <meta name="twitter:description" content={buildDescription} />
        <meta name="twitter:card" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
        <meta name="twitter:title" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
        <meta property="og:title" content={`${metaTitleContent} | Scinapse | Academic search engine for paper`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://scinapse.io/papers/${paper.id}`} />
        <meta property="og:description" content={buildDescription} />

        <div itemScope={true} itemType="http://schema.org/CreativeWork">
          by <span itemProp="author">{paper.authors[0]}</span> - in <span itemProp="dateCreated">{paper.year}</span>
          - publisher : <span itemProp="publisher">{paper.journal}</span>
        </div>

        <script type="application/ld+json">{JSON.stringify(structureData)}</script>
      </Helmet>
    );
  }
}
