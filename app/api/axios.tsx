import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import EnvChecker from '../helpers/envChecker';
import getAPIPrefix from './getHost';
import { camelCaseKeys } from '../helpers/camelCaseKeys';
// API Gateway timeout is 30000
export const TIMEOUT_FOR_SAFE_RENDERING = 10000;

let axiosIns: AxiosInstance | null = null;

function transformJSONKeysToCamelCase(data: any) {
  if (typeof data === 'string') {
    try {
      data = camelCaseKeys(JSON.parse(data));
    } catch (e) {
      /* Ignore */
    }
  }
  return data;
}

export function getAxiosInstance(config?: AxiosRequestConfig) {
  if (EnvChecker.isOnServer()) {
    return Axios.create({
      ...config,
      baseURL: getAPIPrefix(),
      withCredentials: true,
      timeout: TIMEOUT_FOR_SAFE_RENDERING,
      transformResponse: [transformJSONKeysToCamelCase],
    });
  }
  // client
  if (axiosIns) return axiosIns;

  return (axiosIns = Axios.create({
    baseURL: getAPIPrefix(),
    withCredentials: true,
    timeout: 60000,
    transformResponse: [transformJSONKeysToCamelCase],
  }));
}
