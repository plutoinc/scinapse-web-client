import React, { FC, memo } from 'react';
import { Helmet } from 'react-helmet';
import { Author } from '../../../../model/author/author';

interface Props {
  author: Author;
}

const ProfileShowPageHelmet: FC<Props> = memo(({ author }) => {
  const affiliationName = author.lastKnownAffiliation ? author.lastKnownAffiliation.name : '';
  const description = `${affiliationName ? `${affiliationName} |` : ''} citation: ${author.citationCount} | h-index: ${
    author.hindex
  }`;
  const structuredData: any = {
    '@context': 'http://schema.org',
    '@type': 'Person',
    name: author.name,
    affiliation: {
      '@type': 'Organization',
      name: affiliationName,
    },
    description: `${affiliationName ? `${affiliationName} |` : ''} citation: ${author.citationCount} | h-index: ${
      author.hindex
    }`,
    mainEntityOfPage: 'https://scinapse.io',
  };

  return (
    <Helmet>
      <title>{`${author.name} | Scinapse`}</title>
      <link rel="canonical" href={`https://scinapse.io/authors/${author.id}`} />
      <meta itemProp="name" content={`${author.name} | Scinapse`} />
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content={`${author.name} | Scinapse`} />
      <meta name="twitter:title" content={`${author.name} | Scinapse`} />
      <meta property="og:title" content={`${author.name} | Scinapse`} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://scinapse.io/authors/${author.id}`} />
      <meta property="og:description" content={description} />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
});

export default ProfileShowPageHelmet;
