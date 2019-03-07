const xmlString = `
<?xml version="1.0" encoding="UTF-8"?>

<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
 <ShortName>Scinapse</ShortName>
 <Description>Use Scinapse Search</Description>
 <Tags>Scinapse</Tags>
 <Url type="text/html"
      template="http://scinapse.io/search?query={searchTerms}&sort=RELEVANCE&filter=year%3D%3A%2Cfos%3D%2Cjournal%3D&page=1"/>
</OpenSearchDescription>
`;

export function serveOpenSearchXML() {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/opensearchdescription+xml",
    },
    isBase64Encoded: false,
    body: xmlString,
  };
}
