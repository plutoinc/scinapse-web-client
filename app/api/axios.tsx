import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import EnvChecker from '../helpers/envChecker';
import getAPIHost from './getHost';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

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
      baseURL: getAPIHost(),
      withCredentials: true,
      timeout: 55000,
      transformResponse: [transformJSONKeysToCamelCase],
    });
  }
  // client
  if (axiosIns) return axiosIns;

  return (axiosIns = Axios.create({
    baseURL: getAPIHost(),
    withCredentials: true,
    timeout: 60000,
    transformResponse: [transformJSONKeysToCamelCase],
  }));
}
