import PlutoAxios from "../pluto";
import { IMemberRecord, recordifyMember, IMember, initialMember } from "../../model/member";
import {
  ICreateNewAccountParams,
  ICreateNewAccountWithSocialParams,
  ISignInParams,
  ISignInResult,
  ISignInWithSocialParams,
  ISignInData,
  IGetAuthorizeUriParams,
  IPostExchangeParams,
  IGetAuthorizeUriResult,
  IPostExchangeResult,
  IVerifyEmailResult,
} from "../types/auth";

class AuthAPI extends PlutoAxios {
  public async signUp(userInfo: ICreateNewAccountParams): Promise<IMemberRecord> {
    if (userInfo.email === "") {
      throw new Error("FAKE ERROR");
    } else {
      const mockMemberRawData: IMember = initialMember;

      return recordifyMember(mockMemberRawData);
    }
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
    const signInData: ISignInData = result.data;
    const signInResult: ISignInResult = {
      loggedIn: signInData.loggedIn,
      oauthLoggedIn: signInData.oauthLoggedIn,
      token: signInData.token,
      member: recordifyMember(signInData.member),
    };

    return signInResult;
  }

  public async signInWithSocial(exchangeData: ISignInWithSocialParams): Promise<ISignInResult> {
    const result = await this.post("/auth/oauth/login", {
      code: exchangeData.code,
      redirectUri: exchangeData.redirectUri,
      vendor: exchangeData.vendor,
    });
    const signInData: ISignInData = result.data;
    const signInResult: ISignInResult = {
      loggedIn: signInData.loggedIn,
      oauthLoggedIn: signInData.oauthLoggedIn,
      token: signInData.token,
      member: recordifyMember(signInData.member),
    };

    return signInResult;
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
    const checkLoggedInData: ISignInData = result.data;
    const checkLoggedInResult: ISignInResult = {
      loggedIn: checkLoggedInData.loggedIn,
      oauthLoggedIn: checkLoggedInData.oauthLoggedIn,
      token: checkLoggedInData.token,
      member: recordifyMember(checkLoggedInData.member),
    };

    return checkLoggedInResult;
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
