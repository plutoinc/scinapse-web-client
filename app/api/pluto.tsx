import axios, { AxiosRequestConfig } from "axios";
import getAPIHost from "./getHost";

export default class PlutoAxios {
  protected instance = axios.create({
    baseURL: getAPIHost(),
    withCredentials: true,
    timeout: 1000
  });

  protected get(path: string, config?: AxiosRequestConfig) {
    try {
      return this.instance.get(path, config);
    } catch (err) {
      // TODO: Add error tracker
    }
  }

  protected post(path: string, data?: any, config?: AxiosRequestConfig) {
    try {
      return this.instance.post(path, data, config);
    } catch (err) {
      // TODO: Add error tracker
    }
  }
}
