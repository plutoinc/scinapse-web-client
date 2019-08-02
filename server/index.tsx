import * as path from 'path';
import * as fs from 'fs';
import * as cookie from 'cookie';
import * as AWS from 'aws-sdk';
import getSitemap from './routes/sitemap';
import manifestJSON from './routes/manifest';
import getRobotTxt from './routes/robots';
import getOpenSearchXML from './routes/openSearchXML';
import { LIVE_TESTS, getRandomUserGroup } from '../app/constants/abTest';
import ssr from './ssr';
import { AWS_SSM_PARAM_STORE_NAME } from '../scripts/deploy/config';

interface CustomCookieObject {
  value: string;
  options?: cookie.CookieSerializeOptions;
}

const SITEMAP_REGEX = /^\/sitemap(\/sitemap_[0-9]+\.xml)?\/?$/;
const ssm = new AWS.SSM({ region: 'us-east-1' });

const handler = async (event: LambdaProxy.Event): Promise<LambdaProxy.Response> => {
  console.log(JSON.stringify(event, null, 2));
  console.log(fs.readdirSync(path.resolve(__dirname)));
  console.log('-----------');
  console.log(fs.readdirSync(path.resolve(__dirname, '../client/loadable-stats.json')));
  const pathname = event.path;
  const headers: { [key: string]: string } = {};
  for (const key of Object.keys(event.headers)) {
    headers[key.toLowerCase()] = event.headers[key];
  }

  console.log(event.headers);

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
    const body = getRobotTxt(headers.host === 'scinapse.io');

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

  let version = '';
  const branch = event.queryStringParameters && event.queryStringParameters.branch;
  console.log('currentBranch =', branch);
  if (headers.host === 'scinapse.io') {
    version = fs.readFileSync(path.resolve(__dirname, './version')).toString('utf8');
  } else if (branch) {
    const escapedBranch = branch.replace('/', '-');
    const globalParams = await ssm
      .getParameter({
        Name: AWS_SSM_PARAM_STORE_NAME,
      })
      .promise();

    if (!globalParams.Parameter || !globalParams.Parameter.Value) {
      throw new Error('No global parameters exist in AWS-SSM');
    }
    const currentBranchVersionString = globalParams.Parameter.Value;
    const branchMap = JSON.parse(currentBranchVersionString);

    version = branchMap[escapedBranch];
  }

  const cookies = cookie.parse(headers.cookie || '');
  const newCookies: { [key: string]: string | CustomCookieObject } = {
    ...cookies,
  };
  const keys = Object.keys(cookies);
  LIVE_TESTS.forEach(test => {
    if (!keys.includes(test.name)) {
      const randomUserGroup = getRandomUserGroup(test.name);
      newCookies[test.name] = { value: randomUserGroup, options: { maxAge: 2592000 } };
    } else {
      newCookies[test.name] = { value: cookies[test.name], options: { maxAge: 2592000 } };
    }
  });

  const cookieKeys = Object.keys(newCookies);
  const cookieValues = cookieKeys.map(cookieKey => {
    if (typeof newCookies[cookieKey] === 'string') {
      return cookie.serialize(cookieKey, newCookies[cookieKey] as string);
    } else {
      return cookie.serialize(
        cookieKey,
        (newCookies[cookieKey] as CustomCookieObject).value,
        (newCookies[cookieKey] as CustomCookieObject).options
      );
    }
  });

  const html = await ssr(event, version);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
    multiValueHeaders: {
      'Set-Cookie': cookieValues,
    },
    body: html,
  };
};

export default handler;
