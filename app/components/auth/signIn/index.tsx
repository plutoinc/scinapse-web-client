import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { ISignInStateRecord, SIGN_IN_ON_FOCUS_TYPE } from "./records";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { AuthInputBox } from "../../common/inputBox/authInputBox";

const styles = require("./signIn.scss");

interface ISignInContainerProps extends DispatchProp<ISignInContainerMappedState> {
  signInState: ISignInStateRecord;
  handleChangeDialogType?: (type: GLOBAL_DIALOG_TYPE) => void;
}

interface ISignInContainerMappedState {
  signInState: ISignInStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    signInState: state.signIn,
  };
}

class SignIn extends React.PureComponent<ISignInContainerProps, {}> {
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

  private signIn = () => {
    const { signInState, dispatch } = this.props;
    const email = signInState.email;
    const password = signInState.password;

    dispatch(
      Actions.signIn({
        email,
        password,
      }),
    );
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

  private getCreateAccountBtn = (handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void = null) => {
    if (!handleChangeDialogType) {
      return (
        <Link className={styles.createAccountBtn} to="sign_up">
          Create Account
        </Link>
      );
    } else {
      return (
        <div
          className={styles.createAccountBtn}
          onClick={() => {
            handleChangeDialogType(GLOBAL_DIALOG_TYPE.SIGN_UP);
          }}
        >
          Create Account
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

  private getSubmitBtn = (isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className={styles.loadingSubmitBtn}>
          <ButtonSpinner className={styles.buttonSpinner} />
          Sign in
        </div>
      );
    } else {
      return (
        <div tabIndex={0} onClick={this.signIn} className={styles.submitBtn}>
          Sign in
        </div>
      );
    }
  };

  public render() {
    const { signInState, handleChangeDialogType } = this.props;
    const { hasError, onFocus, isLoading } = signInState;

    return (
      <div className={styles.signInContainer}>
        <div className={styles.formContainer}>
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
          {hasError && <div style={{ height: 18.5 }} /> // this is for adjusting height when hasError
          }
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
          {this.getSubmitBtn(isLoading)}
          <div className={styles.orSeparatorBox}>
            <div className={styles.dashedSeparator} />
            <div className={styles.orContent}>or</div>
            <div className={styles.dashedSeparator} />
          </div>
          {this.getCreateAccountBtn(handleChangeDialogType)}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignIn);
