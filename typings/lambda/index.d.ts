declare namespace LambdaProxy {
  interface Event {
    resource?: string;
    path: string;
    httpMethod: string;
    headers: EventHeaders;
    queryStringParameters?: EventQueryStringParameters;
    pathParameters?: EventPathParameters;
    stageVariables?: EventStageVariables;
    requestContext?: {
      accountId: string;
      resourceId: string;
      stage: string;
      requestId: string;
      identity: {
        cognitoIdentityPoolId: string;
        accountId: string;
        cognitoIdentityId: string;
        caller: string;
        apiKey: string;
        sourceIp: string;
        accessKey: string;
        cognitoAuthenticationType: string;
        cognitoAuthenticationProvider: string;
        userArn: string;
        userAgent: string;
        user: string;
      };
      resourcePath: string;
      httpMethod: string;
      apiId: string;
    };
    isBase64Encoded?: boolean;
    body?: string;
  }

  interface EventHeaders {
    [key: string]: string;
  }

  interface EventQueryStringParameters {
    [key: string]: string;
  }

  interface EventPathParameters {
    [key: string]: string;
  }

  interface EventStageVariables {
    [key: string]: string;
  }

  // Response
  interface Response {
    statusCode: number;
    headers: { [key: string]: string };
    body: string;
    multiValueHeaders?: { [name: string]: string[] };
    isBase64Encoded?: boolean;
  }

  interface Context {
    // Properties
    functionName: string;
    functionVersion: string;
    invokedFunctionArn: string;
    memoryLimitInMB: number;
    awsRequestId: string;
    logGroupName: string;
    logStreamName: string;
    identity?: CognitoIdentity;
    clientContext?: ClientContext;
    callbackWaitsForEmptyEventLoop?: boolean;

    // Functions
    getRemainingTimeInMillis(): number;
  }

  interface CognitoIdentity {
    cognito_identity_id: string;
    cognito_identity_pool_id: string;
  }

  interface ClientContext {
    client: ClientContextClient;
    Custom?: any;
    env: ClientContextEnv;
  }

  interface ClientContextClient {
    installation_id: string;
    app_title: string;
    app_version_name: string;
    app_version_code: string;
    app_package_name: string;
  }

  interface ClientContextEnv {
    platform_version: string;
    platform: string;
    make: string;
    model: string;
    locale: string;
  }
}
