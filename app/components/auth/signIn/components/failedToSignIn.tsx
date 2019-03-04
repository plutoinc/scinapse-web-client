import * as React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { parse } from "qs";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { GLOBAL_DIALOG_TYPE } from "../../../dialog/reducer";
import Icon from "../../../../icons";
import AuthTabs from "../../authTabs";
import AuthButton from "../../authButton";
import { oAuthBtnBaseStyle, handleClickOAuthBtn } from "../../signUp/components/firstForm";
const s = require("./failedToSignIn.scss");

interface FailedToSignInProps {
  onClickGoBack: () => void;
  onClickTab: (type: GLOBAL_DIALOG_TYPE) => void;
}

const FailedToSignIn: React.FunctionComponent<FailedToSignInProps & RouteComponentProps<any>> = props => {
  const queryParams = parse(props.location.search, { ignoreQueryPrefix: true });
  const vendor = queryParams.vendor;

  let vendorContent;
  let socialBtn = null;
  switch (vendor) {
    case "FACEBOOK":
      vendorContent = "Facebook";
      socialBtn = (
        <AuthButton
          isLoading={false}
          text="SIGN UP WITH FACEBOOK"
          style={{ ...oAuthBtnBaseStyle, width: "331px", backgroundColor: "#3859ab" }}
          iconName="FACEBOOK_LOGO"
          iconClassName={s.fbIconWrapper}
          onClick={handleClickOAuthBtn("FACEBOOK")}
        />
      );
      break;
    case "GOOGLE":
      vendorContent = "Google";
      socialBtn = (
        <AuthButton
          isLoading={false}
          text="SIGN UP WITH GOOGLE"
          style={{ ...oAuthBtnBaseStyle, width: "331px", backgroundColor: "#dc5240" }}
          iconName="GOOGLE_LOGO"
          iconClassName={s.googleIconWrapper}
          onClick={handleClickOAuthBtn("GOOGLE")}
        />
      );
      break;
    case "ORCID":
      vendorContent = "Orcid";
      socialBtn = (
        <AuthButton
          isLoading={false}
          text="SIGN UP WITH ORCID"
          style={{ ...oAuthBtnBaseStyle, width: "331px", backgroundColor: "#a5d027" }}
          iconName="ORCID_LOGO"
          iconClassName={s.orcidIconWrapper}
          onClick={handleClickOAuthBtn("ORCID")}
        />
      );
      break;
    default:
      vendorContent = "Social service";
      break;
  }

  return (
    <div className={s.signInContainer}>
      <div className={s.formContainer}>
        <AuthTabs onClickTab={props.onClickTab} activeTab="sign in" />
        <Icon className={s.unsignedWithSocialIconWrapper} icon="UNSIGNED_WITH_SOCIAL" />
        <div className={s.unsignedWithSocialTitle}>SIGN IN FAILED</div>
        <div className={s.unsignedWithSocialContent}>
          {`You are unsigned user.
        Would you like to sign up with ${vendorContent}?`}
        </div>
        {socialBtn}
        <div onClick={props.onClickGoBack} className={s.goBackButton}>
          GO BACK
        </div>
      </div>
    </div>
  );
};

export default withRouter(withStyles<typeof FailedToSignIn>(s)(FailedToSignIn));
