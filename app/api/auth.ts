import PlutoAxios from './pluto';
import { Member } from '../model/member';
import {
  SignInWithEmailParams,
  SignInResult,
  SignInData,
  VerifyEmailResult,
  CheckDuplicatedEmailResult,
  OAUTH_VENDOR,
  OAuthCheckResult,
  ChangePasswordParams,
  EmailSettingsResponse,
  UpdateEmailSettingParams,
  SignUpWithSocialAPIParams,
  SignUpWithEmailAPIParams,
  UpdateUserInformationAPIParams,
} from './types/auth';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

class AuthAPI extends PlutoAxios {
  public async signUpWithEmail(userInfo: SignUpWithEmailAPIParams): Promise<Member> {
    const signUpWithEmailResponse = await this.post('/members', userInfo);
    return camelCaseKeys(signUpWithEmailResponse.data);
  }

  public async signUpWithSocial(userInfo: SignUpWithSocialAPIParams): Promise<Member> {
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

  public async update(params: UpdateUserInformationAPIParams): Promise<Member> {
    const res = await this.put('/members/me', params);

    return camelCaseKeys(res.data);
  }

  public async changePassword({ oldPassword, newPassword }: ChangePasswordParams) {
    const res = await this.put('/members/me/password', {
      old_password: oldPassword,
      new_password: newPassword,
    });

    return camelCaseKeys(res.data);
  }

  public async getEmailSettings(token?: string): Promise<EmailSettingsResponse> {
    const res = await this.get(`/notifications/email/settings?token=${token}`);
    return camelCaseKeys(res.data);
  }

  public async updateEmailSetting({
    token,
    type,
    setting,
  }: UpdateEmailSettingParams): Promise<{
    success: boolean;
  }> {
    const res = await this.put(`/notifications/email/settings?token=${token}`, {
      type,
      setting: setting ? 'ON' : 'OFF',
    });
    return res.data.data.content;
  }
}

const apiHelper = new AuthAPI();

export default apiHelper;
