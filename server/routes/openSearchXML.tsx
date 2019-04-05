export default function getOpenSearchXML() {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/" xmlns:moz="http://www.mozilla.org/2006/browser/search/">
    <ShortName>Scinapse</ShortName>
    <Description>Search for academic information on scinapse.io</Description>
    <InputEncoding>UTF-8</InputEncoding>
    <Image width="16" height="16" type="image/x-icon">https://assets.pluto.network/scinapse/favicon.ico</Image>
    <Url type="text/html" method="get" template="https://scinapse.io/search?query={searchTerms}&amp;sort=RELEVANCE&amp;filter=year%3D%3A%2Cfos%3D%2Cjournal%3D&amp;page=1&amp;from=opensearch"/>
    <Url type="application/opensearchdescription+xml" rel="self" template="https://scinapse.io/opensearch.xml" />
    <moz:SearchForm>https://scinapse.io</moz:SearchForm>
  </OpenSearchDescription>
`;
}
