import PlutoAxios from "./pluto";
import { Member } from "../model/member";
import {
  SignUpWithEmailParams,
  SignUpWithSocialParams,
  ISignInWithEmailParams,
  ISignInResult,
  ISignInWithSocialParams,
  ISignInData,
  IGetAuthorizeUriParams,
  IPostExchangeParams,
  IGetAuthorizeUriResult,
  IPostExchangeResult,
  IVerifyEmailResult,
  ICheckDuplicatedEmailResult,
} from "./types/auth";

class AuthAPI extends PlutoAxios {
  public async signUpWithEmail(userInfo: SignUpWithEmailParams): Promise<Member> {
    const signUpWithEmailResponse = await this.post("/members", userInfo);
    return signUpWithEmailResponse.data;
  }

  public async signUpWithSocial(userInfo: SignUpWithSocialParams): Promise<Member> {
    const signUpWithSocialResponse = await this.post("/members/oauth", userInfo);
    return signUpWithSocialResponse.data;
  }

  public async signInWithEmail(userInfo: ISignInWithEmailParams): Promise<ISignInResult> {
    const signInWithEmailResponse = await this.post("/auth/login", {
      email: userInfo.email,
      password: userInfo.password,
    });
    const signInData: ISignInData = signInWithEmailResponse.data;
    return signInData;
  }

  public async signInWithSocial(exchangeData: ISignInWithSocialParams): Promise<ISignInResult> {
    const signInWithSocialResponse = await this.post("/auth/oauth/login", {
      code: exchangeData.code,
      redirectUri: exchangeData.redirectUri,
      vendor: exchangeData.vendor,
    });
    const signInData: ISignInData = signInWithSocialResponse.data;
    return signInData;
  }

  public async refresh() {
    await this.get("auth/refresh");
  }

  public async signOut() {
    await this.post("auth/logout");
  }

  public async checkDuplicatedEmail(email: string): Promise<ICheckDuplicatedEmailResult> {
    const checkDuplicatedEmailResponse = await this.get("/members/checkDuplication", {
      params: {
        email,
      },
    });

    return checkDuplicatedEmailResponse.data;
  }

  public async checkLoggedIn(): Promise<ISignInResult> {
    const checkLoggedInResponse = await this.get("/auth/login");
    const checkLoggedInData: ISignInData = checkLoggedInResponse.data;

    return checkLoggedInData;
  }

  public async getAuthorizeUri({ vendor, redirectUri }: IGetAuthorizeUriParams): Promise<IGetAuthorizeUriResult> {
    const getAuthorizeUriResponse = await this.get("/auth/oauth/authorize-uri", {
      params: {
        vendor,
        redirectUri,
      },
    });

    return getAuthorizeUriResponse.data;
  }

  public async postExchange({ code, redirectUri, vendor }: IPostExchangeParams): Promise<IPostExchangeResult> {
    const postExchangeResponse = await this.post("/auth/oauth/exchange", {
      code,
      redirectUri,
      vendor,
    });

    return postExchangeResponse.data;
  }

  public async verifyToken(token: string): Promise<IVerifyEmailResult> {
    const verifyTokenResponse = await this.post("/email-verification", {
      token,
    });

    return verifyTokenResponse.data;
  }

  public async resendVerificationEmail(email: string): Promise<IVerifyEmailResult> {
    const resendVerificationEmailResponse = await this.post("/email-verification/resend", {
      email,
    });

    return resendVerificationEmailResponse.data;
  }

  public async requestResetPasswordToken(email: string): Promise<{ success: boolean }> {
    const response = await this.post("/members/password-token", {
      email,
    });

    return response.data;
  }

  public async resetPassword(password: string, token: string): Promise<{ success: boolean }> {
    const response = await this.post("/members/reset-password", {
      password,
      token,
    });

    return response.data;
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
