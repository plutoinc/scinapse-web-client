import * as path from 'path';
import * as fs from 'fs';
import getSitemap from './routes/sitemap';
import manifestJSON from './routes/manifest';
import getRobotTxt from './routes/robots';
import getOpenSearchXML from './routes/openSearchXML';
import ssr from './ssr';

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

  const files = fs.readdirSync(path.resolve(__dirname));
  console.log('files === ', files);

  // let version = '';
  // if (process.env.NODE_ENV === 'production') {
  //   version = fs.readFileSync(path.resolve(__dirname, './version')).toString('utf8');
  // }

  // setABTest(req, res);

  const html = await ssr(event, 'test');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    body: html,
  };
};

export default handler;
