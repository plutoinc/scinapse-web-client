import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { ISignUpStateRecord, IFormErrorRecord, SIGN_UP_ON_FOCUS_TYPE } from "./records";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { ICreateNewAccountParams } from "./actions";
import { AuthInputBox } from "../../common/inputBox/authInputBox";

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

  private handleRepeatPasswordChange = (repeatPassword: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeRepeatPasswordInput(repeatPassword));
  };

  private checkValidRepeatPasswordInput = () => {
    const { dispatch } = this.props;
    const { password, repeatPassword } = this.props.signUpState;

    dispatch(Actions.checkValidRepeatPasswordInput(password, repeatPassword));
  };

  private handleNameChange = (name: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeNameInput(name));
  };

  private checkValidNameInput = () => {
    const { dispatch } = this.props;
    const { name } = this.props.signUpState;

    dispatch(Actions.checkValidNameInput(name));
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
    const { email, password, repeatPassword, name } = signUpState;
    const params: ICreateNewAccountParams = {
      email,
      password,
      repeatPassword,
      name,
    };

    dispatch(Actions.createNewAccount(params, handleChangeDialogType !== undefined));
  };

  private getAuthNavBar = (handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void = null) => {
    if (!handleChangeDialogType) {
      return (
        <div className={styles.authNavBar}>
          <Link className={styles.signInLink} to="sign_in">
            Sign in
          </Link>
          <Link className={styles.signUpLink} to="sign_up">
            Sign up
          </Link>
        </div>
      );
    } else {
      return (
        <div className={styles.dialogNavBar}>
          <Icon className={styles.navBarIconWrapper} icon="DIALOG_LOGO" />
          <div
            className={styles.dialogSignInLink}
            onClick={() => {
              handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_IN);
            }}
          >
            Sign in
          </div>
          <div
            className={styles.dialogSignUpLink}
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

  private getSignInButton = (handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void = null) => {
    if (!handleChangeDialogType) {
      return (
        <Link className={styles.signInBtn} to="sign_in">
          Sign in
        </Link>
      );
    } else {
      return (
        <div
          className={styles.signInBtn}
          onClick={() => {
            handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_IN);
          }}
        >
          Sign in
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

  public render() {
    const { signUpState, handleChangeDialogType } = this.props;
    const { hasErrorCheck, isLoading, onFocus } = signUpState;

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
            onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.REPEAT_PASSWORD}
            onFocusFunc={() => {
              this.removeFormErrorMessage("repeatPassword");
              this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.REPEAT_PASSWORD);
            }}
            onChangeFunc={this.handleRepeatPasswordChange}
            onBlurFunc={() => {
              this.checkValidRepeatPasswordInput();
              this.onBlurInput();
            }}
            placeHolder="Repeat Password"
            hasError={hasErrorCheck.repeatPassword.hasError}
            inputType="password"
            iconName="PASSWORD_ICON"
          />
          {this.getErrorMessage(hasErrorCheck.repeatPassword)}
          <AuthInputBox
            onFocused={onFocus === SIGN_UP_ON_FOCUS_TYPE.NAME}
            onFocusFunc={() => {
              this.removeFormErrorMessage("name");
              this.onFocusInput(SIGN_UP_ON_FOCUS_TYPE.NAME);
            }}
            onChangeFunc={this.handleNameChange}
            onBlurFunc={() => {
              this.checkValidNameInput();
              this.onBlurInput();
            }}
            placeHolder="Full Name"
            hasError={hasErrorCheck.name.hasError}
            inputType="text"
            iconName="FULL_NAME_ICON"
          />
          {this.getErrorMessage(hasErrorCheck.name)}
          {isLoading === true ? (
            <div className={styles.loadingSubmitBtn}>
              <div className={styles.buttonSpinner}>
                <ButtonSpinner />
              </div>
              Create New Account
            </div>
          ) : (
            <button type="submit" className={styles.submitBtn}>
              Create New Account
            </button>
          )}

          <div className={styles.signInBox}>
            <div className={styles.signInContent}>Already have an account?</div>
            {this.getSignInButton(handleChangeDialogType)}
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUp);
