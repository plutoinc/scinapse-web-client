import PlutoAxios from "./pluto";
import { MemberRecord, recordifyMember, Member } from "../model/member";
import {
  ISignUpWithEmailParams,
  ISignUpWithSocialParams,
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
  public async signUpWithEmail(userInfo: ISignUpWithEmailParams): Promise<MemberRecord> {
    const signUpWithEmailResponse = await this.post("/members", userInfo);
    const rawMember: Member = signUpWithEmailResponse.data;

    return recordifyMember(rawMember);
  }

  public async signUpWithSocial(userInfo: ISignUpWithSocialParams): Promise<MemberRecord> {
    const signUpWithSocialResponse = await this.post("/members/oauth", userInfo);
    const rawMember: Member = signUpWithSocialResponse.data;

    return recordifyMember(rawMember);
  }

  public async signInWithEmail(userInfo: ISignInWithEmailParams): Promise<ISignInResult> {
    const signInWithEmailResponse = await this.post("/auth/login", {
      email: userInfo.email,
      password: userInfo.password,
    });
    const signInData: ISignInData = signInWithEmailResponse.data;
    const signInResult: ISignInResult = {
      loggedIn: signInData.loggedIn,
      oauthLoggedIn: signInData.oauthLoggedIn,
      token: signInData.token,
      member: recordifyMember(signInData.member),
    };

    return signInResult;
  }

  public async signInWithSocial(exchangeData: ISignInWithSocialParams): Promise<ISignInResult> {
    const signInWithSocialResponse = await this.post("/auth/oauth/login", {
      code: exchangeData.code,
      redirectUri: exchangeData.redirectUri,
      vendor: exchangeData.vendor,
    });
    const signInData: ISignInData = signInWithSocialResponse.data;
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
    let recordifiedMember: MemberRecord | null = null;

    if (checkLoggedInData.loggedIn && !!checkLoggedInData.member) {
      recordifiedMember = recordifyMember(checkLoggedInData.member);
    }

    const checkLoggedInResult: ISignInResult = {
      loggedIn: checkLoggedInData.loggedIn,
      oauthLoggedIn: checkLoggedInData.oauthLoggedIn,
      token: checkLoggedInData.token,
      member: recordifiedMember,
    };

    return checkLoggedInResult;
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
}

const apiHelper = new AuthAPI();

export default apiHelper;
