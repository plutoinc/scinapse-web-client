import axios, { AxiosRequestConfig, AxiosError } from "axios";
import EnvChecker from "../helpers/envChecker";
import { CommonError } from "../model/error";

const WORKING_SHOP_API = "https://team-b.dev-api.scinapse.io";
export const TIMEOUT_FOR_SAFE_RENDERING = 15000;

export default class WorkingshopAxios {
  public static getGlobalError(axiosResponse: AxiosError) {
    const errorObj: CommonError =
      axiosResponse.response && axiosResponse.response.data && axiosResponse.response.data.error;
    if (errorObj) {
      return errorObj;
    }
    return axiosResponse;
  }

  protected getInstance = () => {
    return axios.create({
      baseURL: WORKING_SHOP_API,
      withCredentials: true,
      timeout: EnvChecker.isOnServer() ? TIMEOUT_FOR_SAFE_RENDERING : 60000,
    });
  };

  protected get(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - GET : ${WORKING_SHOP_API + path}`);
    }
    return this.getInstance().get(path, config);
  }

  protected post(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - POST : ${WORKING_SHOP_API + path}`);
    }
    return this.getInstance().post(path, data, config);
  }

  protected put(path: string, data?: any, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - PUT : ${WORKING_SHOP_API + path}`);
    }
    return this.getInstance().put(path, data, config);
  }

  protected delete(path: string, config?: AxiosRequestConfig) {
    if (EnvChecker.isOnServer()) {
      console.log(`HTTP REQUEST - DELETE : ${WORKING_SHOP_API + path}`);
    }
    return this.getInstance().delete(path, config);
  }
}
