import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { ISignInStateRecord } from "./records";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";

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

  public render() {
    const { signInState, handleChangeDialogType } = this.props;
    const { hasError } = signInState;

    return (
      <div className={styles.signInContainer}>
        <div className={styles.formContainer}>
          {this.getAuthNavBar(handleChangeDialogType)}
          <div>
            <div className={hasError ? `${styles.formBox} ${styles.hasError}` : styles.formBox}>
              <Icon className={styles.formBoxIconWrapper} icon="EMAIL_ICON" />
              <div className={styles.separatorLine} />
              <input
                onChange={e => {
                  this.handleEmailChange(e.currentTarget.value);
                }}
                placeholder="E-mail"
                value={signInState.email}
                className={`form-control ${styles.inputBox}`}
                type="email"
              />
            </div>
            <div className={hasError ? `${styles.formBox} ${styles.hasError}` : styles.formBox}>
              <Icon className={styles.formBoxIconWrapper} icon="PASSWORD_ICON" />
              <div className={styles.separatorLine} />
              <input
                onChange={e => {
                  this.handlePasswordChange(e.currentTarget.value);
                }}
                value={signInState.password}
                placeholder="Password"
                className={`form-control ${styles.inputBox}`}
                type="password"
              />
            </div>
          </div>
          <div
            className={styles.errorContent}
            style={
              hasError ? (
                {
                  display: "flex",
                }
              ) : null
            }
          >
            Invalid combination. Have another go
          </div>
          <div onClick={this.signIn} className={styles.submitBtn}>
            Sign in
          </div>
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
