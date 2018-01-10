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
  ICheckDuplicatedEmailResult,
} from "../types/auth";

class AuthAPI extends PlutoAxios {
  public async signUp(userInfo: ICreateNewAccountParams): Promise<IMemberRecord> {
    if (userInfo.email === "") {
      throw new Error("FAKE ERROR");
    } else {
      const mockMemberRawData: IMember = {
        ...initialMember,
        email: userInfo.email,
        name: userInfo.name,
        affiliation: userInfo.affiliation,
      };

      return recordifyMember(mockMemberRawData);
    }
  }

  public async signUpWithSocial(userInfo: ICreateNewAccountWithSocialParams): Promise<IMemberRecord> {
    if (userInfo.email === "") {
      throw new Error("FAKE ERROR");
    } else {
      const mockMemberRawData: IMember = {
        ...initialMember,
        email: userInfo.email,
        name: userInfo.name,
        affiliation: userInfo.affiliation,
      };

      return recordifyMember(mockMemberRawData);
    }
  }

  public async signIn(userInfo: ISignInParams): Promise<ISignInResult> {
    if (!userInfo.email || !userInfo.password) {
      throw new Error("FAKE ERROR");
    } else {
      const mockMemberRawData: IMember = {
        ...initialMember,
        email: userInfo.email,
      };

      const mockSignInResult: ISignInResult = {
        loggedIn: true,
        oauthLoggedIn: false,
        token: "",
        member: recordifyMember(mockMemberRawData),
      };
      return mockSignInResult;
    }
  }

  public async signInWithSocial(exchangeData: ISignInWithSocialParams): Promise<ISignInResult> {
    if (!exchangeData) {
      throw new Error("FAKE ERROR");
    } else {
      const mockMemberRawData: IMember = initialMember;

      const mockSignInResult: ISignInResult = {
        loggedIn: true,
        oauthLoggedIn: true,
        token: "",
        member: recordifyMember(mockMemberRawData),
      };
      return mockSignInResult;
    }
  }

  public async refresh() {
    await this.get("auth/refresh");
  }

  public async signOut() {
    return;
  }

  public async checkDuplicatedEmail(email: string): Promise<ICheckDuplicatedEmailResult> {
    if (email === "") {
      throw new Error("FAKE ERROR");
    } else {
      return {
        duplicated: false,
      };
    }
  }

  public async checkLoggedIn(): Promise<ISignInResult> {
    const mockMemberRawData: IMember = initialMember;

    const mockCheckLoggedInResult: ISignInResult = {
      loggedIn: true,
      oauthLoggedIn: false,
      token: "",
      member: recordifyMember(mockMemberRawData),
    };
    return mockCheckLoggedInResult;
  }

  public async getAuthorizeUri({ vendor, redirectUri }: IGetAuthorizeUriParams): Promise<IGetAuthorizeUriResult> {
    if (!vendor || !redirectUri) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        vendor,
        uri: "",
      };
    }
  }

  public async postExchange({ code, redirectUri, vendor }: IPostExchangeParams): Promise<IPostExchangeResult> {
    if (!code || !vendor || !redirectUri) {
      throw new Error("FAKE ERROR");
    } else {
      let connected = false;
      if (code === "isConnected") {
        connected = true;
      }
      return {
        vendor,
        oauthId: "",
        userData: {
          email: "",
          name: "",
        },
        uuid: "",
        connected,
      };
    }
  }

  public async verifyToken(token: string): Promise<IVerifyEmailResult> {
    if (!token) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        success: true,
      };
    }
  }

  public async resendVerificationEmail(email: string): Promise<IVerifyEmailResult> {
    if (!email) {
      throw new Error("FAKE ERROR");
    } else {
      return {
        success: true,
      };
    }
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
