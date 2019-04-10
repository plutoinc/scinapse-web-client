"use strict";
exports.__esModule = true;
function getOpenSearchXML() {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n  <OpenSearchDescription xmlns=\"http://a9.com/-/spec/opensearch/1.1/\" xmlns:moz=\"http://www.mozilla.org/2006/browser/search/\">\n    <ShortName>Scinapse</ShortName>\n    <Description>Search for academic information on scinapse.io</Description>\n    <InputEncoding>UTF-8</InputEncoding>\n    <Image width=\"16\" height=\"16\" type=\"image/x-icon\">https://assets.pluto.network/scinapse/favicon.ico</Image>\n    <Url type=\"text/html\" method=\"get\" template=\"https://scinapse.io/search?query={searchTerms}&amp;sort=RELEVANCE&amp;filter=year%3D%3A%2Cfos%3D%2Cjournal%3D&amp;page=1\"/>\n    <Url type=\"application/opensearchdescription+xml\" rel=\"self\" template=\"https://scinapse.io/opensearch.xml\" />\n    <moz:SearchForm>https://scinapse.io</moz:SearchForm>\n  </OpenSearchDescription>\n";
}
exports["default"] = getOpenSearchXML;
