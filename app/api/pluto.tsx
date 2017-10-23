import axios, { AxiosRequestConfig } from "axios";
import getAPIHost from "./getHost";

export default class PlutoAxios {
  protected instance = axios.create({
    baseURL: getAPIHost(),
    withCredentials: true,
    timeout: 30000,
  });

  protected get(path: string, config?: AxiosRequestConfig) {
    return this.instance.get(path, config);
  }

  protected post(path: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post(path, data, config);
  }

  protected put(path: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put(path, data, config);
  }
}
