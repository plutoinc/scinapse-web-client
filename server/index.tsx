import * as path from 'path';
import * as fs from 'fs';
import getSitemap from './routes/sitemap';
import manifestJSON from './routes/manifest';
import getRobotTxt from './routes/robots';
import getOpenSearchXML from './routes/openSearchXML';
const SITEMAP_REGEX = /^\/sitemap(\/sitemap_[0-9]+\.xml)?\/?$/;

const handler = async (event: LambdaProxy.Event): Promise<LambdaProxy.Response> => {
  console.log(JSON.stringify(event, null, 2));
  const pathname = event.path;

  if (SITEMAP_REGEX.test(pathname)) {
    const res = await getSitemap(pathname);
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-Encoding': 'gzip',
        'Content-Type': 'text/xml',
        'Access-Control-Allow-Origin': '*',
      },
      body: res.body,
    };
  }

  if (pathname === '/manifest.json') {
    const json = manifestJSON;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(json),
    };
  }

  if (pathname === '/robots.txt') {
    const body = getRobotTxt(event.headers.host === 'scinapse.io');

    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'max-age=100',
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    };
  }

  if (pathname === '/opensearch.xml') {
    const body = getOpenSearchXML();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body,
    };
  }

  if (pathname === '/sw.js') {
    const buf = fs.readFileSync(path.resolve(__dirname, 'sw.js'));
    return {
      statusCode: 200,
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Origin': '*',
      },
      body: buf.toString('base64'),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'SUCCESS' }),
  };
};

export default handler;
