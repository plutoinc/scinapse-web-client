import PlutoAxios from './pluto';
import { Member } from '../model/member';
import {
  SignUpWithEmailParams,
  SignUpWithSocialParams,
  SignInWithEmailParams,
  SignInResult,
  SignInWithSocialParams,
  SignInData,
  GetAuthorizeUriParams,
  GetAuthorizeUriResult,
  VerifyEmailResult,
  CheckDuplicatedEmailResult,
  OAUTH_VENDOR,
  OAuthCheckResult,
  UpdateUserInformationParams,
} from './types/auth';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

class AuthAPI extends PlutoAxios {
  public async signUpWithEmail(userInfo: SignUpWithEmailParams): Promise<Member> {
    const signUpWithEmailResponse = await this.post('/members', userInfo);
    return camelCaseKeys(signUpWithEmailResponse.data);
  }

  public async signUpWithSocial(userInfo: SignUpWithSocialParams): Promise<Member> {
    const signUpWithSocialResponse = await this.post('/members/oauth', userInfo);
    return camelCaseKeys(signUpWithSocialResponse.data);
  }

  public async signInWithEmail(userInfo: SignInWithEmailParams): Promise<SignInResult> {
    const signInWithEmailResponse = await this.post('/auth/login', {
      email: userInfo.email,
      password: userInfo.password,
    });
    const signInData: SignInData = signInWithEmailResponse.data;
    return camelCaseKeys(signInData);
  }

  public async signInWithSocial(exchangeData: SignInWithSocialParams): Promise<SignInResult> {
    const signInWithSocialResponse = await this.post('/auth/oauth/login', {
      code: exchangeData.code,
      redirectUri: exchangeData.redirectUri,
      vendor: exchangeData.vendor,
    });
    const signInData: SignInData = signInWithSocialResponse.data;
    return camelCaseKeys(signInData);
  }

  public async refresh() {
    await this.get('auth/refresh');
  }

  public async signOut() {
    await this.post('auth/logout');
  }

  public async checkDuplicatedEmail(email: string): Promise<CheckDuplicatedEmailResult> {
    const checkDuplicatedEmailResponse = await this.get('/members/checkDuplication', {
      params: {
        email,
      },
    });

    return checkDuplicatedEmailResponse.data;
  }

  public async checkLoggedIn(): Promise<SignInResult> {
    const checkLoggedInResponse = await this.get('/auth/login');
    const checkLoggedInData: SignInData = checkLoggedInResponse.data;

    return camelCaseKeys(checkLoggedInData);
  }

  public async getAuthorizeURI({ vendor, redirectURI }: GetAuthorizeUriParams): Promise<GetAuthorizeUriResult> {
    const res = await this.get('/auth/oauth/authorize-uri', {
      params: {
        vendor,
        redirectUri: redirectURI,
      },
    });

    return res.data;
  }

  public async verifyToken(token: string): Promise<VerifyEmailResult> {
    const verifyTokenResponse = await this.post('/email-verification', {
      token,
    });

    return verifyTokenResponse.data;
  }

  public async resendVerificationEmail(email: string): Promise<VerifyEmailResult> {
    const resendVerificationEmailResponse = await this.post('/email-verification/resend', {
      email,
    });

    return resendVerificationEmailResponse.data;
  }

  public async requestResetPasswordToken(email: string): Promise<{ success: boolean }> {
    const response = await this.post('/members/password-token', email);

    return response.data;
  }

  public async resetPassword(password: string, token: string): Promise<{ success: boolean }> {
    const response = await this.post('/members/reset-password', {
      password,
      token,
    });

    return response.data;
  }

  public async checkOAuthStatus(vendor: OAUTH_VENDOR, token: string): Promise<OAuthCheckResult> {
    const res = await this.post('/auth/oauth/check', { vendor, token });

    return camelCaseKeys(res.data.data.content);
  }

  public async loginWithOAuth(vendor: OAUTH_VENDOR, token: string): Promise<SignInResult> {
    const res = await this.post('/auth/oauth/login', { vendor, token });

    return camelCaseKeys(res.data);
  }

  public async update(params: UpdateUserInformationParams): Promise<Member> {
    const res = await this.put('/members/me', {
      affiliation_id: params.affiliation.id,
      affiliation_name: params.affiliation.name,
      firstName: params.firstName,
      lastName: params.lastName,
    });

    return camelCaseKeys(res.data);
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
