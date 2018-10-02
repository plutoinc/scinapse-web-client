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
    const { dispatch } = this.props;
    const searchParams = this.getParsedSearchParamsObject();
    const searchCode = searchParams.code;
    const searchVendor = searchParams.vendor;

    if (!!searchCode && searchVendor) {
      dispatch(Actions.getAuthorizeCode(searchCode, searchVendor));
    }
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
                <AuthInputBox
                  isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.FIRST_NAME}
                  onFocusFunc={() => {
                    this.removeFormErrorMessage("firstName");
                    this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.FIRST_NAME);
                  }}
                  onChangeFunc={this.handleFirstNameChange}
                  onBlurFunc={() => {
                    this.checkValidNameInput();
                    this.onBlurInput();
                  }}
                  defaultValue={firstName}
                  placeHolder="First Name"
                  hasError={hasErrorCheck.firstName.hasError}
                  inputType="string"
                  iconName="FULL_NAME_ICON"
                />
                <AuthInputBox
                  isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.LASTNAME}
                  onFocusFunc={() => {
                    this.removeFormErrorMessage("lastName");
                    this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.LASTNAME);
                  }}
                  onChangeFunc={this.handleLastNameChange}
                  onBlurFunc={() => {
                    this.checkValidNameInput();
                    this.onBlurInput();
                  }}
                  defaultValue={lastName}
                  placeHolder="LastName"
                  hasError={hasErrorCheck.lastName.hasError}
                  inputType="string"
                  iconName="FULL_NAME_ICON"
                  wrapperStyles={{ marginLeft: "10px" }}
                />
              </div>
              {this.getErrorContent(hasErrorCheck.firstName)}
              {this.getErrorContent(hasErrorCheck.lastName)}
              <AuthInputBox
                isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.AFFILIATION}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("affiliation");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.AFFILIATION);
                }}
                onChangeFunc={this.handleAffiliationChange}
                onBlurFunc={() => {
                  this.checkValidAffiliationInput();
                  this.onBlurInput();
                }}
                defaultValue={affiliation}
                placeHolder="Affiliation / Company"
                hasError={hasErrorCheck.affiliation.hasError}
                inputType="string"
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
              <AuthInputBox
                isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.EMAIL}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("email");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.EMAIL);
                }}
                onChangeFunc={this.handleEmailChange}
                onBlurFunc={() => {
                  this.checkValidEmailInput();
                  this.checkDuplicatedEmail();
                  this.onBlurInput();
                }}
                defaultValue={email}
                placeHolder="E-mail"
                hasError={hasErrorCheck.email.hasError}
                inputType="email"
                iconName="EMAIL_ICON"
              />
              {this.getErrorContent(hasErrorCheck.email)}
              <div className={styles.nameInputBox}>
                <AuthInputBox
                  isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.FIRST_NAME}
                  onFocusFunc={() => {
                    this.removeFormErrorMessage("firstName");
                    this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.FIRST_NAME);
                  }}
                  onChangeFunc={this.handleFirstNameChange}
                  onBlurFunc={() => {
                    this.checkValidNameInput();
                    this.onBlurInput();
                  }}
                  defaultValue={firstName}
                  placeHolder="First Name"
                  hasError={hasErrorCheck.firstName.hasError}
                  inputType="string"
                  iconName="FULL_NAME_ICON"
                />
                <AuthInputBox
                  isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.LASTNAME}
                  onFocusFunc={() => {
                    this.removeFormErrorMessage("lastName");
                    this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.LASTNAME);
                  }}
                  onChangeFunc={this.handleLastNameChange}
                  onBlurFunc={() => {
                    this.checkValidNameInput();
                    this.onBlurInput();
                  }}
                  defaultValue={lastName}
                  placeHolder="LastName"
                  hasError={hasErrorCheck.lastName.hasError}
                  inputType="string"
                  iconName="FULL_NAME_ICON"
                  wrapperStyles={{ marginLeft: "10px" }}
                />
              </div>
              {this.getErrorContent(hasErrorCheck.firstName)}
              {this.getErrorContent(hasErrorCheck.lastName)}
              <AuthInputBox
                isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.AFFILIATION}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("affiliation");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.AFFILIATION);
                }}
                onChangeFunc={this.handleAffiliationChange}
                onBlurFunc={() => {
                  this.checkValidAffiliationInput();
                  this.onBlurInput();
                }}
                defaultValue={affiliation}
                placeHolder="Affiliation / Company"
                hasError={hasErrorCheck.affiliation.hasError}
                inputType="string"
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
              <AuthInputBox
                isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.EMAIL}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("email");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.EMAIL);
                }}
                onChangeFunc={this.handleEmailChange}
                onBlurFunc={() => {
                  this.checkValidEmailInput();
                  this.checkDuplicatedEmail();
                  this.onBlurInput();
                }}
                defaultValue={email}
                placeHolder="E-mail"
                hasError={hasErrorCheck.email.hasError}
                inputType="email"
                iconName="EMAIL_ICON"
              />
              {this.getErrorContent(hasErrorCheck.email)}
              <AuthInputBox
                isFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.PASSWORD}
                onFocusFunc={() => {
                  this.removeFormErrorMessage("password");
                  this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.PASSWORD);
                }}
                onChangeFunc={this.handlePasswordChange}
                onBlurFunc={() => {
                  this.checkValidPasswordInput();
                  this.onBlurInput();
                }}
                defaultValue={password}
                placeHolder="Password"
                hasError={hasErrorCheck.password.hasError}
                inputType="password"
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

  private checkValidNameInput = () => {
    const { dispatch } = this.props;
    const { firstName } = this.props.signUpState;

    dispatch(Actions.checkValidNameInput(firstName));
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

  private signUpWithEmail = (currentStep: SIGN_UP_STEP) => {
    const { signUpState, dispatch, handleChangeDialogType } = this.props;
    const isDialog = !!handleChangeDialogType;

    dispatch(Actions.signUpWithEmail(currentStep, signUpState, isDialog));
  };

  private signUpWithSocial = (currentStep: SIGN_UP_STEP, vendor: OAUTH_VENDOR) => {
    const { signUpState, dispatch, location } = this.props;
    if (currentStep === SIGN_UP_STEP.FIRST) {
      store.set("oauthRedirectPath", `${location.pathname}${location.search}`);
    }
    const oauthRedirectPathCookie = store.get("oauthRedirectPath");

    dispatch(Actions.signUpWithSocial(currentStep, vendor, oauthRedirectPathCookie, signUpState));
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
