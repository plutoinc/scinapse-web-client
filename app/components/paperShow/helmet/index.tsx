import * as React from 'react';
import Helmet from 'react-helmet';
import { Paper } from '../../../model/paper';
import { PaperAuthor } from '../../../model/author';
import { Journal } from '../../../model/journal';
import { getPDFLink } from '../../../helpers/getPDFLink';

const buildPageDescription = (paper: Paper) => {
  const shortAbstract = paper.abstract ? `${paper.abstract.slice(0, 110)} | ` : '';
  const shortAuthors =
    paper.authors && paper.authors.length > 0
      ? `${paper.authors
          .map(author => {
            return author && author.name;
          })
          .join(', ')
          .slice(0, 50)}  | `
      : '';
  const shortJournals = paper.journal ? `${paper.journal.title.slice(0, 50)} | ` : '';
  return `${shortAbstract}${shortAuthors}${shortJournals}`;
};

function formatAuthorsToStructuredData(authors: PaperAuthor[]) {
  return authors.map(author => {
    const affiliationName = author.organization || (author.affiliation && author.affiliation.name);
    return {
      '@type': 'Person',
      name: author.name,
      affiliation: {
        '@type': 'Organization',
        name: affiliationName || '',
      },
    };
  });
}

function formatPublisherToStructuredData(journal: Journal) {
  return {
    '@type': 'Organization',
    name: journal.title,
    logo: {
      '@type': 'ImageObject',
      url: 'https://assets.pluto.network/scinapse/scinapse-logo.png',
    },
  };
}

const getStructuredData = (paper: Paper) => {
  const author =
    paper.authors && paper.authors.length > 0
      ? formatAuthorsToStructuredData(paper.authors)
      : { '@type': 'Person', name: '' };
  const publisher = paper.journal
    ? formatPublisherToStructuredData(paper.journal)
    : { '@type': 'Organization', name: '' };
  const structuredData: any = {
    '@context': 'http://schema.org',
    '@type': 'ScholarlyArticle',
    headline: paper.title,
    identifier: paper.doi,
    description: paper.abstract,
    name: paper.title,
    image: ['https://assets.pluto.network/scinapse/scinapse-logo.png'],
    datePublished: paper.publishedDate,
    dateModified: paper.publishedDate,
    about: paper.fosList.map(fos => ({ '@type': 'Thing', name: fos.fos })),
    mainEntityOfPage: `https://scinapse.io/papers/${paper.id}`,
    author,
    publisher,
  };

  return structuredData;
};

const PaperShowHelmet: React.FC<{ paper: Paper }> = React.memo(({ paper }) => {
  const pdfSourceRecord = getPDFLink(paper.urls);
  const metaTitleContent = !!pdfSourceRecord ? '[PDF] ' + paper.title : paper.title;

  return (
    <Helmet>
      <title>{`${metaTitleContent} | Scinapse`}</title>
      <link rel="canonical" href={`https://scinapse.io/papers/${paper.id}`} />
      <meta itemProp="name" content={`${metaTitleContent} | Scinapse`} />
      <meta name="description" content={buildPageDescription(paper)} />
      <meta name="twitter:title" content={`${metaTitleContent} | Scinapse`} />
      <meta name="twitter:description" content={buildPageDescription(paper)} />
      <meta name="twitter:card" content={`${metaTitleContent} | Scinapse`} />
      <meta property="og:title" content={`${metaTitleContent} | Scinapse`} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://scinapse.io/papers/${paper.id}`} />
      <meta property="og:description" content={buildPageDescription(paper)} />
      <script type="application/ld+json">{JSON.stringify(getStructuredData(paper))}</script>
    </Helmet>
  );
});

export default PaperShowHelmet;
