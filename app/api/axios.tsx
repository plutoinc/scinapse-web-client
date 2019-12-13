import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import EnvChecker from '../helpers/envChecker';
import getAPIHost from './getHost';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

let axiosIns: AxiosInstance | null = null;

export function getAxiosInstance(config?: AxiosRequestConfig) {
  if (EnvChecker.isOnServer()) {
    return Axios.create({
      ...config,
      baseURL: getAPIHost(),
      withCredentials: true,
      timeout: 55000,
      transformResponse: [
        data => {
          return camelCaseKeys(JSON.parse(data));
        },
      ],
    });
  }
  // client
  if (axiosIns) return axiosIns;

  return (axiosIns = Axios.create({
    baseURL: getAPIHost(),
    withCredentials: true,
    timeout: 60000,
    transformResponse: [
      data => {
        return camelCaseKeys(JSON.parse(data));
      },
    ],
  }));
}
