const handler = async (event: LambdaProxy.Event): Promise<LambdaProxy.Response> => {
  console.log(JSON.stringify(event, null, 2));
  console.log(event.path);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ error: 'Not Found' }),
  };
};

export default handler;
