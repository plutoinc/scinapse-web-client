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

  private signIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  private getSubmitBtn = (isLoading: boolean) => {
    if (!isLoading) {
      return (
        <div className={styles.loadingSubmitBtn}>
          <ButtonSpinner className={styles.buttonSpinner} />
          SIGN IN
        </div>
      );
    } else {
      return (
        <button type="submit" className={styles.submitBtn}>
          SIGN IN
        </button>
      );
    }
  };

  public render() {
    const { signInState, handleChangeDialogType } = this.props;
    const { hasError, onFocus, isLoading } = signInState;

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
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignIn);
