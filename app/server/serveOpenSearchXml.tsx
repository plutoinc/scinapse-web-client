const xmlString = `
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
<ShortName>Scinapse</ShortName>
<Description>Search </Description>
<Language>*</Language>
<InputEncoding>UTF-8</InputEncoding>
<Image width="16" height="16" type="image/x-icon">https://assets.pluto.network/scinapse/favicon.ico</Image>
<Tags>scinapse academic scholar science paper medicine</Tags>
<Contact>dev@pluto.network</Contact>
<Url type="text/html" template="http://scinapse.io/search?query={searchTerms}&sort=RELEVANCE&filter=year%3D%3A%2Cfos%3D%2Cjournal%3D&page=1"/>
<moz:SearchForm>https://scinapse.io</moz:SearchForm>
<Url type="application/opensearchdescription+xml" rel="self" template="https://scinapse.io/" />
</OpenSearchDescription>
`;

export function serveOpenSearchXML() {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
    isBase64Encoded: false,
    body: xmlString,
  };
}
