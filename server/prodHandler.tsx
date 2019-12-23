import handler from '.';

export const ssr = async (event: LambdaProxy.Event) => {
  try {
    const resBody = handler(event);
    return resBody;
  } catch (err) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
