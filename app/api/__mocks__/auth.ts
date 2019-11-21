import PlutoAxios from '../pluto';
import { Member } from '../../model/member';
import {
  SignUpWithEmailParams,
  SignUpWithSocialParams,
  SignInWithEmailParams,
  SignInResult,
  SignInWithSocialParams,
  GetAuthorizeUriParams,
  GetAuthorizeUriResult,
  VerifyEmailResult,
  CheckDuplicatedEmailResult,
} from '../types/auth';
import { RAW } from '../../__mocks__';

class AuthAPI extends PlutoAxios {
  public async signUpWithEmail(userInfo: SignUpWithEmailParams): Promise<Member> {
    if (userInfo.email === '') {
      throw new Error('FAKE ERROR');
    } else {
      const mockMember: Member = {
        ...RAW.MEMBER,
        email: userInfo.email,
        firstName: userInfo.firstName,
        affiliationName: userInfo.affiliation,
      };

      return mockMember;
    }
  }

  public async signUpWithSocial(userInfo: SignUpWithSocialParams): Promise<Member> {
    if (userInfo.email === '') {
      throw new Error('FAKE ERROR');
    } else {
      const mockMember: Member = {
        ...RAW.MEMBER,
        email: userInfo.email,
        firstName: userInfo.firstName,
        affiliationName: userInfo.affiliation,
      };

      return mockMember;
    }
  }

  public async signInWithEmail(userInfo: SignInWithEmailParams): Promise<SignInResult> {
    if (!userInfo.email || !userInfo.password) {
      throw new Error('FAKE ERROR');
    } else {
      const mockMember: Member = {
        ...RAW.MEMBER,
        email: userInfo.email,
      };

      const mockSignInResult: SignInResult = {
        loggedIn: true,
        oauthLoggedIn: false,
        token: '',
        member: mockMember,
      };
      return mockSignInResult;
    }
  }

  public async signInWithSocial(exchangeData: SignInWithSocialParams): Promise<SignInResult> {
    if (!exchangeData) {
      throw new Error('FAKE ERROR');
    } else {
      const mockMember: Member = RAW.MEMBER;

      const mockSignInResult: SignInResult = {
        loggedIn: true,
        oauthLoggedIn: true,
        token: '',
        member: mockMember,
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

  public async checkDuplicatedEmail(email: string): Promise<CheckDuplicatedEmailResult> {
    if (email === '') {
      throw new Error('FAKE ERROR');
    } else {
      return {
        duplicated: false,
      };
    }
  }

  public async checkLoggedIn(): Promise<SignInResult> {
    const mockMember: Member = RAW.MEMBER;

    const mockCheckLoggedInResult: SignInResult = {
      loggedIn: true,
      oauthLoggedIn: false,
      token: '',
      member: mockMember,
    };
    return mockCheckLoggedInResult;
  }

  public async getAuthorizeURI({ vendor, redirectURI }: GetAuthorizeUriParams): Promise<GetAuthorizeUriResult> {
    if (!vendor || !redirectURI) {
      throw new Error('FAKE ERROR');
    } else {
      return {
        vendor,
        uri: '',
      };
    }
  }

  public async verifyToken(token: string): Promise<VerifyEmailResult> {
    if (!token) {
      throw new Error('FAKE ERROR');
    } else {
      return {
        success: true,
      };
    }
  }

  public async resendVerificationEmail(email: string): Promise<VerifyEmailResult> {
    if (!email) {
      throw new Error('FAKE ERROR');
    } else {
      return {
        success: true,
      };
    }
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
