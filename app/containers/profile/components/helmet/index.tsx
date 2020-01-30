import React, { FC, memo } from 'react';
import { Helmet } from 'react-helmet';
import { Profile } from '../../../../model/profile';

interface Props {
  profile: Profile;
}

const ProfileShowPageHelmet: FC<Props> = memo(({ profile }) => {
  const affiliationName = profile.affiliationName || '';
  const description = `${affiliationName ? `${affiliationName} |` : ''} citation: ${profile.citationCount} | h-index: ${
    profile.hindex
  }`;
  const name = `${profile.firstName} ${profile.lastName}`;
  const structuredData: any = {
    '@context': 'http://schema.org',
    '@type': 'Person',
    name,
    affiliation: {
      '@type': 'Organization',
      name: affiliationName,
    },
    description: `${affiliationName ? `${affiliationName} |` : ''} citation: ${profile.citationCount} | h-index: ${
      profile.hindex
    }`,
    mainEntityOfPage: 'https://scinapse.io',
  };

  return (
    <Helmet>
      <title>{`${name} | Scinapse`}</title>
      <link rel="canonical" href={`https://scinapse.io/authors/${profile.id}`} />
      <meta itemProp="name" content={`${name} | Scinapse`} />
      <meta name="description" content={description} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:card" content={`${name} | Scinapse`} />
      <meta name="twitter:title" content={`${name} | Scinapse`} />
      <meta property="og:title" content={`${name} | Scinapse`} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={`https://scinapse.io/authors/${profile.id}`} />
      <meta property="og:description" content={description} />
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Helmet>
  );
});

export default ProfileShowPageHelmet;
