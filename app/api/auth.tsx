import PlutoAxios from "./pluto";
import { IMemberRecord, recordifyMember, IMember } from "../model/member";

export interface ICreateNewAccountParams {
  email: string;
  password: string;
  name: string;
  affiliation: string;
}

export interface ICreateNewAccountWithSocialParams {
  email: string;
  name: string;
  affiliation: string;
  oauth: {
    oauthId: string;
    uuid: string;
    vendor: OAUTH_VENDOR;
  };
}

export interface ISignInParams {
  email: string;
  password: string;
}

export interface ISignInWithSocialParams {
  code: string;
  redirectUri: string;
  vendor: OAUTH_VENDOR;
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
  connected: Boolean;
}

export interface IVerifyEmailResult {
  success: Boolean;
}

export interface ISignInResult {
  loggedIn: Boolean;
  oauthLoggedIn: Boolean;
  token: string;
  member: IMember;
}

class AuthAPI extends PlutoAxios {
  public async signUp(userInfo: ICreateNewAccountParams): Promise<IMemberRecord> {
    const result = await this.post("/members", userInfo);

    return recordifyMember(result.data);
  }

  public async signUpWithSocial(userInfo: ICreateNewAccountWithSocialParams): Promise<IMemberRecord> {
    const result = await this.post("/members/oauth", userInfo);

    return recordifyMember(result.data);
  }

  public async signIn(userInfo: ISignInParams): Promise<ISignInResult> {
    const result = await this.post("/auth/login", {
      email: userInfo.email,
      password: userInfo.password,
    });

    return result.data;
  }

  public async signInWithSocial(exchangeData: ISignInWithSocialParams): Promise<ISignInResult> {
    const result = await this.post("/auth/oauth/login", {
      code: exchangeData.code,
      redirectUri: exchangeData.redirectUri,
      vendor: exchangeData.vendor,
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

  public async checkLoggedIn(): Promise<ISignInResult> {
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

  public async verifyToken(token: string): Promise<IVerifyEmailResult> {
    const result = await this.post("email-verification", {
      token,
    });

    return result.data;
  }

  public async resendVerificationEmail(email: string): Promise<IVerifyEmailResult> {
    const result = await this.post("email-verification/resend", {
      email,
    });

    return result.data;
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
