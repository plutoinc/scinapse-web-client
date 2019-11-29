import React from 'react';
import { Button } from '@pluto_network/pluto-design-elements';
import GoogleAuthButton from './googleAuthButton';
import Icon from '../../../icons';
import { handleClickORCIDBtn } from '../signUp/actions';
import { OAuthCheckParams } from '../../../api/types/auth';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./authButtons.scss');

interface AuthButtonsProps {
  handleClickFBLogin: () => void;
  handleClickGoogleLogin: (values: OAuthCheckParams) => void;
  FBIsLoading: boolean;
  isLoading: boolean;
}

const AuthButtons: React.FC<AuthButtonsProps> = props => {
  useStyles(s);
  const { handleClickFBLogin, handleClickGoogleLogin, FBIsLoading, isLoading } = props;

  return (
    <>
      <div className={s.authButtonWrapper}>
        <Button
          size="large"
          elementType="button"
          aria-label="Facebook oauth button"
          style={{ backgroundColor: '#3859ab', borderColor: '#3859ab' }}
          onClick={handleClickFBLogin}
          disabled={FBIsLoading}
          isLoading={isLoading}
          fullWidth
        >
          <Icon icon="FACEBOOK_LOGO" />
          <span>Continue with Facebook</span>
        </Button>
      </div>
      <div className={s.authButtonWrapper}>
        <GoogleAuthButton isLoading={isLoading} onSignUpWithSocial={handleClickGoogleLogin} />
      </div>
      <div className={s.authButtonWrapper}>
        <Button
          size="large"
          elementType="button"
          aria-label="ORCID oauth button"
          style={{ backgroundColor: '#a5d027', borderColor: '#a5d027' }}
          disabled={FBIsLoading}
          isLoading={isLoading}
          onClick={handleClickORCIDBtn}
          fullWidth
        >
          <Icon icon="ORCID_LOGO" />
          <span>Continue with ORCID</span>
        </Button>
      </div>
    </>
  );
};

export default AuthButtons;
