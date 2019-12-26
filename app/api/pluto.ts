import { AxiosRequestConfig, AxiosError } from 'axios';
import getAPIHost from './getHost';
import EnvChecker from '../helpers/envChecker';
import { CommonError } from '../model/error';
import { getAxiosInstance } from './axios';

export const TIMEOUT_FOR_SAFE_RENDERING = 55000;

export default class PlutoAxios {
  public static getGlobalError(axiosResponse: AxiosError) {
    const errorObj: CommonError =
      axiosResponse.response && axiosResponse.response.data && axiosResponse.response.data.error;
    if (errorObj) {
      return errorObj;
    }
    return axiosResponse;
  }

  protected get(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - GET : ${getAPIHost() + path}`);
    }
    return getAxiosInstance().get(path, config);
  }

  protected post(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - POST : ${getAPIHost() + path}`);
    }
    return getAxiosInstance().post(path, data, config);
  }

  protected put(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - PUT : ${getAPIHost() + path}`);
    }
    return getAxiosInstance().put(path, data, config);
  }

  protected delete(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - DELETE : ${getAPIHost() + path}`);
    }
    return getAxiosInstance().delete(path, config);
  }
}
