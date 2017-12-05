import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import { ISignUpStateRecord, IFormErrorRecord, SIGN_UP_ON_FOCUS_TYPE, SIGN_UP_STEP } from "./records";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { ICreateNewAccountParams } from "./actions";
import { AuthInputBox } from "../../common/inputBox/authInputBox";
import { trackAction } from "../../../helpers/handleGA";
import Icon from "../../../icons";

const styles = require("./signUp.scss");

interface ISignUpContainerProps extends DispatchProp<ISignUpContainerMappedState> {
  signUpState: ISignUpStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
}

interface ISignUpContainerMappedState {
  signUpState: ISignUpStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    signUpState: state.signUp,
  };
}

class SignUp extends React.PureComponent<ISignUpContainerProps, {}> {
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

  private handleAffiliationChange = (affiliation: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAffiliationInput(affiliation));
  };

  private checkValidAffiliationInput = () => {
    const { dispatch } = this.props;
    const { affiliation } = this.props.signUpState;

    dispatch(Actions.checkValidAffiliationInput(affiliation));
  };

  private handleAffiliationEmailChange = (affiliationEmail: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAffiliationEmailInput(affiliationEmail));
  };

  private removeFormErrorMessage = (type: string) => {
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

  private createNewAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { signUpState, dispatch, handleChangeDialogType } = this.props;
    const { email, password, affiliation, affiliationEmail } = signUpState;
    const params: ICreateNewAccountParams = {
      email,
      password,
      affiliation,
      affiliationEmail,
    };

    dispatch(Actions.createNewAccount(params, handleChangeDialogType !== undefined));
  };

  private getAuthNavBar = (handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void = null) => {
    if (!handleChangeDialogType) {
      return (
        <div className={styles.authNavBar}>
          <Link
            to="/users/sign_in"
            onClick={() => trackAction("/users/sign_in", "signUpAuthNavBar")}
            className={styles.signInLink}
          >
            Sign in
          </Link>
          <Link
            to="/users/sign_up"
            onClick={() => trackAction("/users/sign_up", "signUpAuthNavBar")}
            className={styles.signUpLink}
          >
            Sign up
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
            Sign in
          </div>
          <div
            className={styles.signUpLink}
            onClick={() => {
              handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_UP);
            }}
          >
            Sign up
          </div>
        </div>
      );
    }
  };

  private getErrorMessage = (formError: IFormErrorRecord) => {
    return (
      <div
        className={styles.errorContent}
        style={
          formError.hasError
            ? {
                display: "flex",
              }
            : null
        }
      >
        {formError.errorMessage}
      </div>
    );
  };

  private getSubmitBtn = (isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className={styles.loadingSubmitBtn}>
          <ButtonSpinner className={styles.buttonSpinner} />
          SIGN UP
        </div>
      );
    } else {
      return (
        <button type="submit" className={styles.submitBtn}>
          SIGN UP
        </button>
      );
    }
  };

  public render() {
    const { signUpState, handleChangeDialogType } = this.props;
    const { hasErrorCheck, isLoading, onFocus, step } = signUpState;

    if (step === SIGN_UP_STEP.FIRST) {
      return (
        <div className={styles.signUpContainer}>
          <form onSubmit={this.createNewAccount} className={styles.formContainer}>
            {this.getAuthNavBar(handleChangeDialogType)}
            <AuthInputBox
              onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.EMAIL}
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
              placeHolder="E-mail (Institution)"
              hasError={hasErrorCheck.email.hasError}
              inputType="email"
              iconName="EMAIL_ICON"
            />
            {this.getErrorMessage(hasErrorCheck.email)}
            <AuthInputBox
              onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.PASSWORD}
              onFocusFunc={() => {
                this.removeFormErrorMessage("password");
                this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.PASSWORD);
              }}
              onChangeFunc={this.handlePasswordChange}
              onBlurFunc={() => {
                this.checkValidPasswordInput();
                this.onBlurInput();
              }}
              placeHolder="Password"
              hasError={hasErrorCheck.password.hasError}
              inputType="password"
              iconName="PASSWORD_ICON"
            />
            {this.getErrorMessage(hasErrorCheck.password)}
            {this.getSubmitBtn(isLoading)}
            <div className={styles.orSeparatorBox}>
              <div className={styles.dashedSeparator} />
              <div className={styles.orContent}>or</div>
              <div className={styles.dashedSeparator} />
            </div>
            <button className={styles.facebookLogin}>
              <Icon className={styles.iconWrapper} icon="FACEBOOK_LOGO" />
              SIGN UP WITH FACEBOOK
            </button>
            <button className={styles.googleLogin}>
              <Icon className={styles.iconWrapper} icon="GOOGLE_LOGO" />
              SIGN UP WITH GOOGLE
            </button>
            <button className={styles.orcidLogin}>
              <Icon className={styles.iconWrapper} icon="ORCID_LOGO" />
              SIGN UP WITH ORCID
            </button>
          </form>
        </div>
      );
    } else if (step === SIGN_UP_STEP.SECOND) {
      return (
        <div className={styles.signUpContainer}>
          <form onSubmit={this.createNewAccount} className={styles.formContainer}>
            {this.getAuthNavBar(handleChangeDialogType)}
            <AuthInputBox
              onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.EMAIL}
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
              placeHolder="E-mail (Institution)"
              hasError={hasErrorCheck.email.hasError}
              inputType="email"
              iconName="EMAIL_ICON"
            />
            {this.getErrorMessage(hasErrorCheck.email)}
            <AuthInputBox
              onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.PASSWORD}
              onFocusFunc={() => {
                this.removeFormErrorMessage("password");
                this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.PASSWORD);
              }}
              onChangeFunc={this.handlePasswordChange}
              onBlurFunc={() => {
                this.checkValidPasswordInput();
                this.onBlurInput();
              }}
              placeHolder="Password"
              hasError={hasErrorCheck.password.hasError}
              inputType="password"
              iconName="PASSWORD_ICON"
            />
            {this.getErrorMessage(hasErrorCheck.password)}
            <AuthInputBox
              onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.AFFILIATION}
              onFocusFunc={() => {
                this.removeFormErrorMessage("affiliation");
                this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.AFFILIATION);
              }}
              onChangeFunc={this.handleAffiliationChange}
              onBlurFunc={() => {
                this.checkValidAffiliationInput();
                this.onBlurInput();
              }}
              placeHolder="Affiliation"
              hasError={hasErrorCheck.affiliation.hasError}
              inputType="string"
              iconName="AFFILIATION_ICON"
            />
            {this.getErrorMessage(hasErrorCheck.affiliation)}
            <AuthInputBox
              onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.AFFILIATION_EMAIL}
              onFocusFunc={() => {
                this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.AFFILIATION_EMAIL);
              }}
              onChangeFunc={this.handleAffiliationEmailChange}
              onBlurFunc={() => {
                this.onBlurInput();
              }}
              placeHolder="Affiliation email (Optional)"
              inputType="string"
              iconName="AFFILIATION_ICON"
            />
            {this.getSubmitBtn(isLoading)}
            <div>GO BACK</div>
          </form>
        </div>
      );
    }
  }
}

export default connect(mapStateToProps)(SignUp);
