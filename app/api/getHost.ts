import EnvChecker from '../helpers/envChecker';

const CLIENT_API_PREFIX = '/api'; // This API HOST is used for a REAL service.
const PROD_SERVER_API_HOST = 'https://api.scinapse.io';
const STAGE_SERVER_API_HOST = 'https://stage-api.scinapse.io:8443';
const DEV_SERVER_API_HOST = 'https://dev.scinapse.io';

export default function getAPIPrefix() {
  if (EnvChecker.isOnServer()) {
    if (process.env.NODE_ENV === 'production') return `${PROD_SERVER_API_HOST}/api`;
    if (process.env.NODE_ENV === 'development') return `${DEV_SERVER_API_HOST}/api`;
    return `${STAGE_SERVER_API_HOST}/api`;
  }

  return CLIENT_API_PREFIX;
}
