import PlutoAxios from "../pluto";
import { MemberRecord, recordifyMember, Member, initialMember } from "../../model/member";
import {
  ISignUpWithEmailParams,
  ISignUpWithSocialParams,
  ISignInWithEmailParams,
  ISignInResult,
  ISignInWithSocialParams,
  IGetAuthorizeUriParams,
  IPostExchangeParams,
  IGetAuthorizeUriResult,
  IPostExchangeResult,
  IVerifyEmailResult,
  ICheckDuplicatedEmailResult,
} from "../types/auth";

class AuthAPI extends PlutoAxios {
  public async signUpWithEmail(userInfo: ISignUpWithEmailParams): Promise<MemberRecord> {
    if (userInfo.email === "") {
      throw new Error("FAKE ERROR");
    } else {
      const mockMemberRawData: Member = {
        ...initialMember,
        email: userInfo.email,
        name: userInfo.name,
        affiliation: userInfo.affiliation,
      };

      return recordifyMember(mockMemberRawData);
    }
  }

  public async signUpWithSocial(userInfo: ISignUpWithSocialParams): Promise<MemberRecord> {
    if (userInfo.email === "") {
      throw new Error("FAKE ERROR");
    } else {
      const mockMemberRawData: Member = {
        ...initialMember,
        email: userInfo.email,
        name: userInfo.name,
        affiliation: userInfo.affiliation,
      };

      return recordifyMember(mockMemberRawData);
    }
  }

  public async signInWithEmail(userInfo: ISignInWithEmailParams): Promise<ISignInResult> {
    if (!userInfo.email || !userInfo.password) {
      throw new Error("FAKE ERROR");
    } else {
      const mockMemberRawData: Member = {
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
      const mockMemberRawData: Member = initialMember;

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
    return;
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
    const mockMemberRawData: Member = initialMember;

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
