import * as React from "react";
import { OAUTH_VENDOR, GetAuthorizeUriResult } from "../../../../../api/types/auth";
import { withStyles } from "../../../../../helpers/withStylesHelper";
import AuthAPI from "../../../../../api/auth";
import EnvChecker from "../../../../../helpers/envChecker";
import * as ReactGA from "react-ga";
import PlutoAxios from "../../../../../api/pluto";
import alertToast from "../../../../../helpers/makePlutoToastAction";
import AuthButton from "../../../authButton";
import Icon from "../../../../../icons";
const s = require("./signInFailed.scss");

interface SignInFailedProps {
  vendor: OAUTH_VENDOR;
}

function handleClickOAuthBtn(vendor: OAUTH_VENDOR) {
  return async () => {
    store.set("oauthRedirectPath", location.pathname + location.search);

    const origin = EnvChecker.getOrigin();
    const redirectURI = `${origin}/users/sign_up?vendor=${vendor}`;

    try {
      const authroizedData: GetAuthorizeUriResult = await AuthAPI.getAuthorizeURI({
        vendor,
        redirectURI,
      });

      ReactGA.set({ referrer: origin });
      window.location.replace(authroizedData.uri);
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
    }
  };
}

function getSocialSignUpButton(vendor: OAUTH_VENDOR) {
  switch (vendor) {
    case "FACEBOOK":
      return (
        <AuthButton
          isLoading={false}
          text="SIGN UP WITH FACEBOOK"
          style={{ ...oAuthBtnBaseStyle, backgroundColor: "#3859ab", marginTop: "18px" }}
          iconName="FACEBOOK_LOGO"
          iconClassName={s.fbIconWrapper}
          onClick={handleClickOAuthBtn("FACEBOOK")}
        />
      );
    case "GOOGLE":
      return (
        <AuthButton
          isLoading={false}
          text="SIGN UP WITH GOOGLE"
          style={{ ...oAuthBtnBaseStyle, backgroundColor: "#dc5240" }}
          iconName="GOOGLE_LOGO"
          iconClassName={s.googleIconWrapper}
          onClick={handleClickOAuthBtn("GOOGLE")}
        />
      );
    case "ORCID":
      return (
        <AuthButton
          isLoading={false}
          text="SIGN UP WITH ORCID"
          style={{ ...oAuthBtnBaseStyle, backgroundColor: "#a5d027", marginBottom: "34px" }}
          iconName="ORCID_LOGO"
          iconClassName={s.orcidIconWrapper}
          onClick={handleClickOAuthBtn("ORCID")}
        />
      );
    default:
      break;
  }
}

const oAuthBtnBaseStyle: React.CSSProperties = { position: "relative", fontSize: "13px", marginTop: "10px" };

const SignInFailed: React.FunctionComponent<SignInFailedProps> = props => {
  const { vendor } = props;
  return (
    <div className={s.signInContainer}>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          this.signInWithEmail();
        }}
        className={s.formContainer}
      >
        <Icon className={s.unsignedWithSocialIconWrapper} icon="UNSIGNED_WITH_SOCIAL" />
        <div className={s.unsignedWithSocialTitle}>SIGN IN FAILED</div>
        <div className={s.unsignedWithSocialContent}>
          {`You are unsigned user.
            Would you like to sign up with ${vendor}?`}
        </div>
        {getSocialSignUpButton(vendor)}
        <div onClick={this.goBack} className={s.goBackButton}>
          GO BACK
        </div>
      </form>
    </div>
  );
};

export default withStyles<typeof SignInFailed>(s)(SignInFailed);
