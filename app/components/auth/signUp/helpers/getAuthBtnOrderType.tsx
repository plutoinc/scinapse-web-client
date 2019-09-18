import { AuthMethodTestType } from '../../../../constants/abTestObject';

export const enum AuthMethodType {
  FACEBOOK,
  GOOGLE,
  ORCID,
}

export function getSortedAuthType(currentAuthMethodType: string) {
  switch (currentAuthMethodType) {
    case AuthMethodTestType.ORCID_TOP:
      return [AuthMethodType.ORCID, AuthMethodType.GOOGLE, AuthMethodType.FACEBOOK];
    case AuthMethodTestType.NO_FACEBOOK:
      return [AuthMethodType.ORCID, AuthMethodType.GOOGLE];
    case AuthMethodTestType.NO_GOOGLE:
      return [AuthMethodType.ORCID, AuthMethodType.FACEBOOK];
    case AuthMethodTestType.ONLY_ORCID:
      return [AuthMethodType.ORCID];
    default:
      return [AuthMethodType.FACEBOOK, AuthMethodType.GOOGLE, AuthMethodType.ORCID];
  }
}
