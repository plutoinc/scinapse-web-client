import * as React from "react";
import { parse } from "qs";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as Actions from "./actions";
import { AppState } from "../../../reducers";
import { FormError, SIGN_UP_ON_FOCUS_TYPE, SIGN_UP_STEP, SignUpErrorCheck } from "./reducer";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/reducer";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import AuthInputBox from "../../common/inputBox/authInputBox";
import { trackAction, trackDialogView } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { OAUTH_VENDOR } from "../../../api/types/auth";
import { SignUpContainerProps, SignUpSearchParams } from "./types";
import { withStyles } from "../../../helpers/withStylesHelper";
import alertToast from "../../../helpers/makePlutoToastAction";
import { closeDialog } from "../../dialog/actions";
import { Field } from "formik";
const store = require("store");
const styles = require("./signUp.scss");

function mapStateToProps(state: AppState) {
  return {
    signUpState: state.signUp,
  };
}

@withStyles<typeof SignUp>(styles)
class SignUp extends React.PureComponent<SignUpContainerProps> {
  public componentDidMount() {
    const { dispatch, history } = this.props;
    const searchParams = this.getParsedSearchParamsObject();
    const searchCode = searchParams.code;
    const searchVendor = searchParams.vendor;

    if (!!searchCode && searchVendor) {
      const alreadySignUpCB = () => {
        history.push("/users/sign_in");
      };
      dispatch(Actions.getAuthorizeCode(searchCode, searchVendor, alreadySignUpCB));
    }
  }

  public componentWillReceiveProps(nextProps: SignUpContainerProps) {
    const { dispatch, location } = this.props;

    if (location !== nextProps.location) {
      dispatch(Actions.goBack());
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(Actions.goBack());
  }

  public render() {
    const { signUpState, handleChangeDialogType } = this.props;
    const {
      hasErrorCheck,
      isLoading,
      onFocus,
      step,
      email,
      password,
      affiliation,
      firstName,
      oauth,
      lastName,
    } = signUpState;

    switch (step) {
      case SIGN_UP_STEP.WITH_EMAIL:
        return (
          <div className={styles.signUpContainer}>
            <form
              onSubmit={e => {
                e.preventDefault();
                this.signUpWithEmail(SIGN_UP_STEP.WITH_EMAIL);
              }}
              className={styles.formContainer}
            >
              {this.getAuthNavBar(handleChangeDialogType)}
              <div className={styles.additionalInformation}>ADDITIONAL INFORMATION</div>
              <div className={styles.subHeader}>No abbreviation preferred</div>
              <div className={styles.fixedFormBox}>
                <Icon className={`${styles.iconWrapper}`} icon="EMAIL_ICON" />
                {email}
              </div>
              <div className={styles.nameInputBox}>
                <Field
                  name="firstName"
                  type="text"
                  component={AuthInputBox}
                  placeholder="First Name"
                  iconName="FULL_NAME_ICON"
                />
                <Field
                  name="lastName"
                  type="text"
                  component={AuthInputBox}
                  placeholder="Last Name"
                  iconName="FULL_NAME_ICON"
                  wrapperStyles={{ marginLeft: "10px" }}
                />
              </div>
              {this.getErrorContent(hasErrorCheck.firstName)}
              {this.getErrorContent(hasErrorCheck.lastName)}
              <Field
                name="affiliation"
                type="text"
                component={AuthInputBox}
                placeholder="Affiliation / Company"
                iconName="AFFILIATION_ICON"
              />
              {this.getErrorContent(hasErrorCheck.affiliation)}
              <div style={{ height: 63 }} />
              {this.getSubmitButton(isLoading)}
              <div onClick={this.goBack} className={styles.goBackButton}>
                GO BACK
              </div>
            </form>
          </div>
        );

      case SIGN_UP_STEP.WITH_SOCIAL:
        return (
          <div className={styles.signUpContainer}>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (oauth && oauth.vendor) {
                  this.signUpWithSocial(SIGN_UP_STEP.WITH_SOCIAL, oauth.vendor);
                }
              }}
              className={styles.formContainer}
            >
              {this.getAuthNavBar(handleChangeDialogType)}
              <div className={styles.additionalInformation}>ADDITIONAL INFORMATION</div>
              <div className={styles.subHeader}>No abbreviation preferred</div>
              <Field name="email" type="email" component={AuthInputBox} placeholder="E-mail" iconName="EMAIL_ICON" />

              {this.getErrorContent(hasErrorCheck.email)}
              <div className={styles.nameInputBox}>
                <Field
                  name="firstName"
                  type="text"
                  component={AuthInputBox}
                  placeholder="First Name"
                  iconName="FULL_NAME_ICON"
                />
                <Field
                  name="lastName"
                  type="text"
                  component={AuthInputBox}
                  placeholder="Last Name"
                  iconName="FULL_NAME_ICON"
                  wrapperStyles={{ marginLeft: "10px" }}
                />
              </div>
              {this.getErrorContent(hasErrorCheck.firstName)}
              {this.getErrorContent(hasErrorCheck.lastName)}
              <Field
                name="affiliation"
                type="text"
                component={AuthInputBox}
                placeholder="Affiliation / Company"
                iconName="AFFILIATION_ICON"
              />

              {this.getErrorContent(hasErrorCheck.affiliation)}
              <div style={{ height: 63 }} />
              {this.getSubmitButton(isLoading)}
              <div onClick={this.goBack} className={styles.goBackButton}>
                GO BACK
              </div>
            </form>
          </div>
        );

      case SIGN_UP_STEP.FINAL_WITH_EMAIL:
      default: {
        return (
          <div className={styles.signUpContainer}>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                this.signUpWithEmail(SIGN_UP_STEP.FINAL_WITH_EMAIL);
              }}
              className={styles.formContainer}
            >
              <div className={styles.finalWithEmailTitle}>THANK YOU FOR REGISTERING</div>
              <div className={styles.finalWithEmailContent}>{`Please complete your email verification
              to become an user.`}</div>
              <Icon className={styles.finalWithEmailIconWrapper} icon="VERIFICATION_EMAIL_ICON" />
              <button type="submit" className={styles.finalWithEmailSubmitButton}>
                CONFIRM
              </button>
            </form>
          </div>
        );
      }

      case SIGN_UP_STEP.FIRST:
        return (
          <div className={styles.signUpContainer}>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                this.signUpWithEmail(SIGN_UP_STEP.FIRST);
              }}
              className={styles.formContainer}
            >
              {this.getAuthNavBar(handleChangeDialogType)}

              <Field name="email" type="email" component={AuthInputBox} placeholder="E-mail" iconName="EMAIL_ICON" />
              {this.getErrorContent(hasErrorCheck.email)}
              <Field
                name="password"
                type="password"
                component={AuthInputBox}
                placeholder="Password"
                iconName="PASSWORD_ICON"
              />

              {this.getErrorContent(hasErrorCheck.password)}
              {this.getSubmitButton(isLoading)}
              <div className={styles.orSeparatorBox}>
                <div className={styles.dashedSeparator} />
                <div className={styles.orContent}>or</div>
                <div className={styles.dashedSeparator} />
              </div>
              <div
                onClick={() => {
                  this.signUpWithSocial(SIGN_UP_STEP.FIRST, "FACEBOOK");
                }}
                className={styles.facebookLogin}
              >
                <Icon className={styles.iconWrapper} icon="FACEBOOK_LOGO" />
                SIGN UP WITH FACEBOOK
              </div>
              <div
                onClick={() => {
                  this.signUpWithSocial(SIGN_UP_STEP.FIRST, "GOOGLE");
                }}
                className={styles.googleLogin}
              >
                <Icon className={styles.iconWrapper} icon="GOOGLE_LOGO" />
                SIGN UP WITH GOOGLE
              </div>
              <div
                onClick={() => {
                  this.signUpWithSocial(SIGN_UP_STEP.FIRST, "ORCID");
                }}
                className={styles.orcidLogin}
              >
                <Icon className={styles.iconWrapper} icon="ORCID_LOGO" />
                SIGN UP WITH ORCID
              </div>
            </form>
          </div>
        );
    }
  }

  private getParsedSearchParamsObject = (): SignUpSearchParams => {
    const { location } = this.props;

    return parse(location.search, { ignoreQueryPrefix: true });
  };

  private handleEmailChange = (email: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeEmailInput(email));
  };

  private checkValidEmailInput = () => {
    const { dispatch } = this.props;
    const { email } = this.props.signUpState;

    dispatch(Actions.checkValidEmailInput(email));
  };

  private checkDuplicatedEmail = () => {
    const { dispatch } = this.props;
    const { email } = this.props.signUpState;

    dispatch(Actions.checkDuplicatedEmail(email));
  };

  private handlePasswordChange = (password: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changePasswordInput(password));
  };

  private checkValidPasswordInput = () => {
    const { dispatch } = this.props;
    const { password } = this.props.signUpState;

    dispatch(Actions.checkValidPasswordInput(password));
  };

  private handleFirstNameChange = (firstName: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeFirstNameInput(firstName));
  };

  private handleLastNameChange = (lastName: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeLastNameInput(lastName));
  };

  private checkFirstValidNameInput = () => {
    const { dispatch } = this.props;
    const { firstName } = this.props.signUpState;

    dispatch(Actions.checkValidNameInput(firstName, "firstName"));
  };

  private checkLastValidNameInput = () => {
    const { dispatch } = this.props;
    const { lastName } = this.props.signUpState;

    dispatch(Actions.checkValidNameInput(lastName, "lastName"));
  };

  private handleAffiliationChange = (affiliation: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAffiliationInput(affiliation));
  };

  private checkValidAffiliationInput = () => {
    const { dispatch } = this.props;
    const { affiliation } = this.props.signUpState;

    dispatch(Actions.checkValidAffiliationInput(affiliation));
  };

  private removeFormErrorMessage = (type: keyof SignUpErrorCheck) => {
    const { dispatch } = this.props;

    dispatch(Actions.removeFormErrorMessage(type));
  };

  private onFocusInput = (type: SIGN_UP_ON_FOCUS_TYPE) => {
    const { dispatch } = this.props;

    dispatch(Actions.onFocusInput(type));
  };

  private onBlurInput = () => {
    const { dispatch } = this.props;

    dispatch(Actions.onBlurInput());
  };

  private signUpWithEmail = async (currentStep: SIGN_UP_STEP) => {
    const { signUpState, dispatch, handleChangeDialogType, history } = this.props;
    const isDialog = !!handleChangeDialogType;

    try {
      await dispatch(Actions.signUpWithEmail(currentStep, signUpState, isDialog));
      if (currentStep === SIGN_UP_STEP.FINAL_WITH_EMAIL && !isDialog) {
        history.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  private signUpWithSocial = async (currentStep: SIGN_UP_STEP, vendor: OAUTH_VENDOR) => {
    const { signUpState, dispatch, location, history } = this.props;
    if (currentStep === SIGN_UP_STEP.FIRST) {
      store.set("oauthRedirectPath", `${location.pathname}${location.search}`);
    }

    try {
      const oauthRedirectPathCookie = store.get("oauthRedirectPath");
      await dispatch(Actions.signUpWithSocial(currentStep, vendor, signUpState));
      const hasToRedirectToHome =
        !oauthRedirectPathCookie ||
        oauthRedirectPathCookie.includes("users/sign_in") ||
        oauthRedirectPathCookie.includes("users/sign_up");
      dispatch(closeDialog());
      if (hasToRedirectToHome) {
        history.push("/");
        alertToast({
          type: "success",
          message: "Succeeded to Sign Up!!",
        });
      } else {
        history.push(oauthRedirectPathCookie);
        alertToast({
          type: "success",
          message: "Succeeded to Sign Up!!",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  private getAuthNavBar = (handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void) => {
    const isDialog = !!handleChangeDialogType;
    if (isDialog) {
      return (
        <div className={styles.authNavBar}>
          <div
            className={styles.signInLink}
            onClick={() => {
              handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_IN);
              trackDialogView("fromSignUpToSignInChange");
            }}
          >
            SIGN IN
          </div>
          <div
            className={styles.signUpLink}
            onClick={() => {
              handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_UP);
              trackDialogView("fromSignUpToSignUpChange");
            }}
          >
            SIGN UP
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.authNavBar}>
          <Link
            to="/users/sign_in"
            onClick={() => trackAction("/users/sign_in", "signUpNavBar")}
            className={styles.signInLink}
          >
            SIGN IN
          </Link>
          <Link
            to="/users/sign_up"
            onClick={() => trackAction("/users/sign_up", "signUpNavBar")}
            className={styles.signUpLink}
          >
            SIGN UP
          </Link>
        </div>
      );
    }
  };

  private getErrorContent = (formError: FormError) => {
    if (formError.hasError) {
      return <div className={styles.errorContent}>{formError.errorMessage}</div>;
    } else {
      return null;
    }
  };

  private getSubmitButton = (isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className={styles.loadingSubmitButton}>
          <ButtonSpinner className={styles.buttonSpinner} />
          SIGN UP
        </div>
      );
    } else {
      return (
        <button type="submit" className={styles.submitButton}>
          SIGN UP
        </button>
      );
    }
  };

  private goBack = () => {
    const { dispatch } = this.props;

    dispatch(Actions.goBack());
  };
}

export default withRouter(connect(mapStateToProps)(SignUp));
