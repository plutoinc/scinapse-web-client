import { AuthMethodTestType } from '../../../../constants/abTestObject';

export const enum authButtonType {
  FACEBOOK,
  GOOGLE,
  ORCID,
}

export function getAuthOrderType(currentAuthMethodType: string) {
  switch (currentAuthMethodType) {
    case AuthMethodTestType.ORCID_TOP:
      return [authButtonType.ORCID, authButtonType.GOOGLE, authButtonType.FACEBOOK];
    case AuthMethodTestType.NO_FACEBOOK:
      return [authButtonType.ORCID, authButtonType.GOOGLE];
    case AuthMethodTestType.NO_GOOGLE:
      return [authButtonType.ORCID, authButtonType.FACEBOOK];
    case AuthMethodTestType.ONLY_ORCID:
      return [authButtonType.ORCID];
    default:
      return [authButtonType.FACEBOOK, authButtonType.GOOGLE, authButtonType.ORCID];
  }
}
