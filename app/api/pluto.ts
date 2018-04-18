import axios, { AxiosRequestConfig } from "axios";
import getAPIHost from "./getHost";
import EnvChecker from "../helpers/envChecker";

export default class PlutoAxios {
  protected instance = axios.create({
    baseURL: getAPIHost(),
    withCredentials: true,
    timeout: 60000,
  });

  protected get(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isServer()) {
      console.log(`HTTP REQUEST - GET : ${getAPIHost() + path}`);
    }
    return this.instance.get(path, config);
  }

  protected post(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isServer()) {
      console.log(`HTTP REQUEST - POST : ${getAPIHost() + path}`);
    }
    return this.instance.post(path, data, config);
  }

  protected put(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isServer()) {
      console.log(`HTTP REQUEST - PUT : ${getAPIHost() + path}`);
    }
    return this.instance.put(path, data, config);
  }

  protected delete(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isServer()) {
      console.log(`HTTP REQUEST - DELETE : ${getAPIHost() + path}`);
    }
    return this.instance.delete(path, config);
  }
}
