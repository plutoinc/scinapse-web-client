import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import { ISignInStateRecord, SIGN_IN_ON_FOCUS_TYPE } from "./records";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { AuthInputBox } from "../../common/inputBox/authInputBox";
import { trackAction } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { OAUTH_VENDOR } from "../../../api/auth";
import { RouteProps } from "react-router";
import { signUpWithSocial } from "../signUp/actions";
import { SIGN_UP_STEP } from "../signUp/records";
import { parse } from "qs";

const reactCookie = require("react-cookie");

const styles = require("./signIn.scss");

interface ISignInContainerProps extends DispatchProp<ISignInContainerMappedState> {
  signInState: ISignInStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
  routing: RouteProps;
  cookies?: any;
}

interface ISignInContainerMappedState {
  signInState: ISignInStateRecord;
  routing: RouteProps;
}

function mapStateToProps(state: IAppState) {
  return {
    signInState: state.signIn,
    routing: state.routing,
  };
}

interface ISignInSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}

class SignIn extends React.PureComponent<ISignInContainerProps, {}> {
  public componentDidMount() {
    const { routing, dispatch } = this.props;
    const locationSearch = routing.location.search;

    const searchParams: ISignInSearchParams = parse(locationSearch, { ignoreQueryPrefix: true });
    const searchCode = searchParams.code;
    const searchVendor: OAUTH_VENDOR = searchParams.vendor;

    if (!!searchCode) {
      const oauthRedirectPathCookie = this.props.cookies.get("oauthRedirectPath");

      dispatch(Actions.getAuthorizeCode(searchCode, searchVendor, oauthRedirectPathCookie));
    }
  }

  private handleEmailChange = (email: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEmailInput(email));
  };

  private handlePasswordChange = (password: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changePasswordInput(password));
  };

  private onFocusInput = (type: SIGN_IN_ON_FOCUS_TYPE) => {
    const { dispatch } = this.props;

    dispatch(Actions.onFocusInput(type));
  };

  private onBlurInput = () => {
    const { dispatch } = this.props;

    dispatch(Actions.onBlurInput());
  };

  private signIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { signInState, dispatch, handleChangeDialogType } = this.props;
    const email = signInState.email;
    const password = signInState.password;

    dispatch(
      Actions.signIn(
        {
          email,
          password,
        },
        !!handleChangeDialogType,
      ),
    );
  };

  private signInWithSocial = (vendor: OAUTH_VENDOR) => {
    const { routing } = this.props;

    this.props.cookies.set("oauthRedirectPath", `${routing.location.pathname}${routing.location.search}`, {
      maxAge: 300,
    });
    Actions.signInWithSocial(vendor);
  };

  private getAuthNavBar = (handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void = null) => {
    if (!handleChangeDialogType) {
      return (
        <div className={styles.authNavBar}>
          <Link
            to="/users/sign_in"
            onClick={() => trackAction("/users/sign_in", "signInNavBar")}
            className={styles.signInLink}
          >
            SIGN IN
          </Link>
          <Link
            to="/users/sign_up"
            onClick={() => trackAction("/users/sign_up", "signInNavBar")}
            className={styles.signUpLink}
          >
            SIGN UP
          </Link>
        </div>
      );
    } else {
      return (
        <div className={styles.authNavBar}>
          <div
            className={styles.signInLink}
            onClick={() => {
              handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_IN);
            }}
          >
            SIGN IN
          </div>
          <div
            className={styles.signUpLink}
            onClick={() => {
              handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_UP);
            }}
          >
            SIGN UP
          </div>
        </div>
      );
    }
  };

  private getErrorContent = (hasError: boolean) => {
    return (
      <div
        className={styles.errorContent}
        style={
          hasError
            ? {
                display: "flex",
              }
            : null
        }
      >
        Invalid combination. Have another go
      </div>
    );
  };

  private getSubmitButton = (isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className={styles.loadingSubmitButton}>
          <ButtonSpinner className={styles.buttonSpinner} />
          SIGN IN
        </div>
      );
    } else {
      return (
        <button type="submit" className={styles.submitButton}>
          SIGN IN
        </button>
      );
    }
  };

  private getSocialSignUpButton = (vendor: OAUTH_VENDOR) => {
    const { dispatch } = this.props;
    const oauthRedirectPathCookie = this.props.cookies.get("oauthRedirectPath");

    switch (vendor) {
      case "FACEBOOK":
        return (
          <div
            onClick={() => {
              dispatch(signUpWithSocial(SIGN_UP_STEP.FIRST, vendor, oauthRedirectPathCookie));
            }}
            className={styles.facebookLogin}
          >
            <Icon className={styles.iconWrapper} icon="FACEBOOK_LOGO" />
            SIGN UP WITH FACEBOOK
          </div>
        );

      case "GOOGLE":
        return (
          <div
            onClick={() => {
              dispatch(signUpWithSocial(SIGN_UP_STEP.FIRST, vendor, oauthRedirectPathCookie));
            }}
            className={styles.googleLogin}
          >
            <Icon className={styles.iconWrapper} icon="GOOGLE_LOGO" />
            SIGN UP WITH GOOGLE
          </div>
        );

      case "ORCID":
        return (
          <div
            onClick={() => {
              dispatch(signUpWithSocial(SIGN_UP_STEP.FIRST, vendor, oauthRedirectPathCookie));
            }}
            className={styles.orcidLogin}
          >
            <Icon className={styles.iconWrapper} icon="ORCID_LOGO" />
            SIGN UP WITH ORCID
          </div>
        );

      default:
        return (
          <div>
            <div
              onClick={() => {
                dispatch(signUpWithSocial(SIGN_UP_STEP.FIRST, "FACEBOOK", oauthRedirectPathCookie));
              }}
              className={styles.facebookLogin}
            >
              <Icon className={styles.iconWrapper} icon="FACEBOOK_LOGO" />
              SIGN UP WITH FACEBOOK
            </div>
            <div
              onClick={() => {
                dispatch(signUpWithSocial(SIGN_UP_STEP.FIRST, "GOOGLE", oauthRedirectPathCookie));
              }}
              className={styles.googleLogin}
            >
              <Icon className={styles.iconWrapper} icon="GOOGLE_LOGO" />
              SIGN UP WITH GOOGLE
            </div>
            <div
              onClick={() => {
                dispatch(signUpWithSocial(SIGN_UP_STEP.FIRST, "ORCID", oauthRedirectPathCookie));
              }}
              className={`${styles.orcidLogin} ${styles.signUpButton}`}
            >
              <Icon className={styles.iconWrapper} icon="ORCID_LOGO" />
              SIGN UP WITH ORCID
            </div>
          </div>
        );
    }
  };

  public render() {
    const { signInState, handleChangeDialogType, routing } = this.props;
    const { hasError, onFocus, isLoading, isUnsignedWithSocial } = signInState;

    if (!isUnsignedWithSocial) {
      return (
        <div className={styles.signInContainer}>
          <form onSubmit={this.signIn} className={styles.formContainer}>
            {this.getAuthNavBar(handleChangeDialogType)}
            <AuthInputBox
              onFocused={onFocus === SIGN_IN_ON_FOCUS_TYPE.EMAIL}
              onFocusFunc={() => {
                this.onFocusInput(SIGN_IN_ON_FOCUS_TYPE.EMAIL);
              }}
              onChangeFunc={this.handleEmailChange}
              onBlurFunc={this.onBlurInput}
              placeHolder="E-mail"
              hasError={hasError}
              inputType="email"
              iconName="EMAIL_ICON"
            />
            <AuthInputBox
              onFocused={onFocus === SIGN_IN_ON_FOCUS_TYPE.PASSWORD}
              onFocusFunc={() => {
                this.onFocusInput(SIGN_IN_ON_FOCUS_TYPE.PASSWORD);
              }}
              onChangeFunc={this.handlePasswordChange}
              onBlurFunc={this.onBlurInput}
              placeHolder="Password"
              hasError={hasError}
              inputType="password"
              iconName="PASSWORD_ICON"
            />
            {this.getErrorContent(hasError)}
            {this.getSubmitButton(isLoading)}
            <div className={styles.orSeparatorBox}>
              <div className={styles.dashedSeparator} />
              <div className={styles.orContent}>or</div>
              <div className={styles.dashedSeparator} />
            </div>
            <div
              onClick={() => {
                this.signInWithSocial("FACEBOOK");
              }}
              className={styles.facebookLogin}
            >
              <Icon className={styles.iconWrapper} icon="FACEBOOK_LOGO" />
              SIGN IN WITH FACEBOOK
            </div>
            <div
              onClick={() => {
                this.signInWithSocial("GOOGLE");
              }}
              className={styles.googleLogin}
            >
              <Icon className={styles.iconWrapper} icon="GOOGLE_LOGO" />
              SIGN IN WITH GOOGLE
            </div>
            <div
              onClick={() => {
                this.signInWithSocial("ORCID");
              }}
              className={styles.orcidLogin}
            >
              <Icon className={styles.iconWrapper} icon="ORCID_LOGO" />
              SIGN IN WITH ORCID
            </div>
          </form>
        </div>
      );
    } else {
      const locationSearch = routing.location.search;
      const searchParams: ISignInSearchParams = parse(locationSearch, { ignoreQueryPrefix: true });
      const searchVendor: OAUTH_VENDOR = searchParams.vendor;

      let vendorContent;
      switch (searchVendor) {
        case "FACEBOOK":
          vendorContent = "Facebook";
          break;
        case "GOOGLE":
          vendorContent = "Google";
          break;
        case "ORCID":
          vendorContent = "Orcid";
          break;
        default:
          vendorContent = "Social service";
          break;
      }

      return (
        <div className={styles.signInContainer}>
          <form onSubmit={this.signIn} className={styles.formContainer}>
            {this.getAuthNavBar(handleChangeDialogType)}
            <Icon className={styles.unsignedWithSocialIconWrapper} icon="UNSIGNED_WITH_SOCIAL" />
            <div className={styles.unsignedWithSocialTitle}>SIGN IN FAILED</div>
            <div className={styles.unsignedWithSocialContent}>
              {`You are unsigned user.
              Would you like to sign up with ${vendorContent}?`}
            </div>
            {this.getSocialSignUpButton(searchVendor)}
            <div onClick={() => {}} className={styles.goBackButton}>
              GO BACK
            </div>
          </form>
        </div>
      );
    }
  }
}

export default reactCookie.withCookies(connect(mapStateToProps)(SignIn));
