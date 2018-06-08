import axios, { AxiosRequestConfig } from "axios";
import getAPIHost from "./getHost";
import EnvChecker from "../helpers/envChecker";

export const TIMEOUT_FOR_SAFE_RENDERING = 5000;

export default class PlutoAxios {
  protected getInstance = () => {
    return axios.create({
      baseURL: getAPIHost(),
      withCredentials: true,
      timeout: EnvChecker.isServer() ? TIMEOUT_FOR_SAFE_RENDERING : 60000,
    });
  };

  protected get(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isServer()) {
      console.log(`HTTP REQUEST - GET : ${getAPIHost() + path}`);
    }
    return this.getInstance().get(path, config);
  }

  protected post(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isServer()) {
      console.log(`HTTP REQUEST - POST : ${getAPIHost() + path}`);
    }
    return this.getInstance().post(path, data, config);
  }

  protected put(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isServer()) {
      console.log(`HTTP REQUEST - PUT : ${getAPIHost() + path}`);
    }
    return this.getInstance().put(path, data, config);
  }

  protected delete(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isServer()) {
      console.log(`HTTP REQUEST - DELETE : ${getAPIHost() + path}`);
    }
    return this.getInstance().delete(path, config);
  }
}
