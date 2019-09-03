import * as newrelic from 'newrelic';
require('@newrelic/aws-sdk');
import handler from '.';

export const ssr = newrelic.setLambdaHandler(async (event: LambdaProxy.Event, _context: LambdaProxy.Context) => {
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
});
