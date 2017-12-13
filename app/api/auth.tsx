import PlutoAxios from "./pluto";
import { ISignInParams } from "../components/auth/signIn/actions";

export interface ICreateNewAccountParams {
  email: string;
  password: string;
  name: string;
  affiliation: string;
}

export type OAUTH_VENDOR = "ORCID" | "FACEBOOK" | "GOOGLE";

export interface IGetAuthorizeUriParams {
  vendor: OAUTH_VENDOR;
  redirectUri?: string;
}

export interface IGetAuthorizeUriResult {
  vendor: OAUTH_VENDOR;
  uri: string;
}

export interface IPostExchangeParams {
  vendor: OAUTH_VENDOR;
  code: string;
  redirectUri?: string;
}

export interface IPostExchangeResult {
  vendor: OAUTH_VENDOR;
  oauthId: string;
  userData: {
    email?: string;
    name?: string;
  };
  uuid: string;
}

class AuthAPI extends PlutoAxios {
  public async signUp(userInfo: ICreateNewAccountParams) {
    const paramObj = {
      email: userInfo.email,
      name: userInfo.name,
      password: userInfo.password,
      affiliation: userInfo.affiliation,
    };

    const result = await this.post("/members", paramObj);
    return result.data;
  }

  public async signIn(userInfo: ISignInParams) {
    const result = await this.post("/auth/login", {
      email: userInfo.email,
      password: userInfo.password,
    });
    return result.data;
  }

  public async refresh() {
    await this.get("auth/refresh");
  }

  public async signOut() {
    await this.post("auth/logout");
  }

  public async checkDuplicatedEmail(email: string) {
    const result = await this.get("members/checkDuplication", {
      params: {
        email,
      },
    });

    return result.data;
  }

  public async checkLoggedIn() {
    const result = await this.get("auth/login");

    return result.data;
  }

  public async getAuthorizeUri({ vendor, redirectUri }: IGetAuthorizeUriParams): Promise<IGetAuthorizeUriResult> {
    const result = await this.get("auth/oauth/authorize-uri", {
      params: {
        vendor,
        redirectUri,
      },
    });

    return result.data;
  }

  public async postExchange({ code, redirectUri, vendor }: IPostExchangeParams): Promise<IPostExchangeResult> {
    const result = await this.post("auth/oauth/exchange", {
      code,
      redirectUri,
      vendor,
    });

    return result.data;
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
