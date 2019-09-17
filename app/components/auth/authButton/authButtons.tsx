import React from 'react';
import { AuthMethodType, getSortedAuthType } from '../signUp/helpers/getAuthBtnOrderType';
import { getUserGroupName } from '../../../helpers/abTestHelper';
import { AUTH_METHOD_EXPERIMENT } from '../../../constants/abTestGlobalValue';
import { AuthMethodTestType } from '../../../constants/abTestObject';
import Button from '../../common/button/button';
import GoogleAuthButton from './googleAuthButton';
import Icon from '../../../icons';
import { handleClickORCIDBtn } from '../signUp/actions';
import { OAuthCheckParams } from '../../../api/types/auth';
import { SIGN_TYPE } from '../types';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./authButtons.scss');

interface AuthButtonsProps {
  signType: SIGN_TYPE;
  handleClickFBLogin: () => void;
  handleClickGoogleLogin: (values: OAuthCheckParams) => void;
  FBIsLoading: boolean;
  isLoading: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = props => {
  useStyles(s);
  const { signType, handleClickFBLogin, handleClickGoogleLogin, FBIsLoading, isLoading } = props;
  const [sortedAuthType, setSortedAuthType] = React.useState<AuthMethodType[]>([]);

  React.useEffect(
    () => {
      const authMethod = getUserGroupName(AUTH_METHOD_EXPERIMENT) || '';
      if (authMethod === AuthMethodTestType.ORCID_TOP || signType === SIGN_TYPE.SIGN_UP) {
        setSortedAuthType(getSortedAuthType(authMethod));
      } else {
        setSortedAuthType(getSortedAuthType(AuthMethodTestType.CONTROL));
      }
    },
    [signType]
  );

  const buttons = sortedAuthType.map(authType => {
    if (authType === AuthMethodType.FACEBOOK) {
      return (
        <div className={s.authButtonWrapper}>
          <Button
            size="large"
            elementType="button"
            style={{ backgroundColor: '#3859ab' }}
            onClick={handleClickFBLogin}
            disabled={FBIsLoading}
            isLoading={isLoading}
            fullWidth
          >
            <Icon icon="FACEBOOK_LOGO" />
            <span>Continue with Facebook</span>
          </Button>
        </div>
      );
    } else if (authType === AuthMethodType.GOOGLE) {
      return (
        <div className={s.authButtonWrapper}>
          <GoogleAuthButton isLoading={isLoading} onSignUpWithSocial={handleClickGoogleLogin} />
        </div>
      );
    } else {
      return (
        <div className={s.authButtonWrapper}>
          <Button
            size="large"
            elementType="button"
            style={{ backgroundColor: '#a5d027' }}
            disabled={FBIsLoading}
            isLoading={isLoading}
            onClick={handleClickORCIDBtn}
            fullWidth
          >
            <Icon icon="ORCID_LOGO" />
            <span>Continue with ORCID</span>
          </Button>
        </div>
      );
    }
  });

  return <>{buttons}</>;
};

export default AuthButtons;
