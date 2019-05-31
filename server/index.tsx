import getSitemap from './routes/sitemap';
const SITEMAP_REGEX = /^\/sitemap(\/sitemap_[0-9]+\.xml)?\/?$/;

const handler = async (event: LambdaProxy.Event): Promise<LambdaProxy.Response> => {
  console.log(JSON.stringify(event, null, 2));
  const path = event.path;

  if (SITEMAP_REGEX.test(path)) {
    const res = await getSitemap(path);
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

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'SUCCESS' }),
  };
};

export default handler;
