import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as Actions from "./actions";
import { debounce } from "lodash";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { ISignUpStateRecord } from "./records";

const styles = require("./signUp.scss");

interface ISignUpContainerProps {
  dispatch: Dispatch<any>;
  signUpState: ISignUpStateRecord;
  dialogChangeFunc?: (type: string) => void;
}

function mapStateToProps(state: IAppState) {
  return {
    signUpState: state.signUp,
  };
}

class SignUp extends React.PureComponent<ISignUpContainerProps, {}> {
  private checkDuplicatedEmail = () => {
    const { signUpState, dispatch } = this.props;

    dispatch(Actions.checkDuplicatedEmail(signUpState.email));
  };

  private debouncedCheckDuplicatedEmail = debounce(this.checkDuplicatedEmail, 2000);

  private handleEmailChange = (email: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeEmailInput(email));
  };

  private checkValidEmailInput = (email: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.checkValidEmailInput(email));
  };

  private handlePasswordChange = (password: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changePasswordInput(password));
  };

  private checkValidPasswordInput = (password: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.checkValidPasswordInput(password));
  };

  private handleRepeatPasswordChange = (repeatPassword: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeRepeatPasswordInput(repeatPassword));
  };

  private checkValidRepeatPasswordInput = (repeatPassword: string) => {
    const { dispatch, signUpState } = this.props;
    dispatch(Actions.checkValidRepeatPasswordInput(signUpState.get("password"), repeatPassword));
  };

  private handleFullNameChange = (fullName: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeFullNameInput(fullName));
  };

  private checkValidFullNameInput = (fullName: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.checkValidFullNameInput(fullName));
  };

  private removeFormErrorMessage = () => {
    const { dispatch } = this.props;
    dispatch(Actions.removeFormErrorMessage());
  };

  private createNewAccount = () => {
    const { signUpState, dispatch } = this.props;
    const { email, password, repeatPassword, fullName } = signUpState;
    dispatch(
      Actions.createNewAccount({
        email,
        password,
        repeatPassword,
        fullName,
      }),
    );
  };

  private getAuthNavBar = (dialogChangeFunc: (type: string) => void = null) => {
    if (!dialogChangeFunc) {
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
        <div className={styles.authNavBar}>
          <Icon className={styles.navBarIconWrapper} icon="HEADER_LOGO" />
          <div
            className={styles.dialogSignInLink}
            onClick={() => {
              dialogChangeFunc("sign_in");
            }}
          >
            Sign in
          </div>
          <div
            className={styles.dialogSignUpLink}
            onClick={() => {
              dialogChangeFunc("sign_up");
            }}
          >
            Sign up
          </div>
        </div>
      );
    }
  };

  private getSignInButton = (dialogChangeFunc: (type: string) => void = null) => {
    if (!dialogChangeFunc) {
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
            dialogChangeFunc("sign_in");
          }}
        >
          Sign in
        </div>
      );
    }
  };

  public render() {
    const { signUpState, dialogChangeFunc } = this.props;
    const { errorType, errorContent } = signUpState;
    return (
      <div className={styles.signUpContainer}>
        <div className={styles.formContainer}>
          {this.getAuthNavBar(dialogChangeFunc)}
          <div className={errorType === "email" ? `${styles.formBox} ${styles.formError}` : styles.formBox}>
            <Icon className={styles.formBoxIconWrapper} icon="EMAIL_ICON" />
            <div className={styles.separatorLine} />
            <input
              onFocus={this.removeFormErrorMessage}
              onChange={e => {
                this.handleEmailChange(e.currentTarget.value);
                this.checkValidEmailInput(e.currentTarget.value);
                this.debouncedCheckDuplicatedEmail();
              }}
              value={signUpState.email}
              placeholder="E-mail (Institution)"
              className={`form-control ${styles.inputBox}`}
              type="email"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "email" ? (
                {
                  display: "flex",
                }
              ) : null
            }
          >
            {errorType === "email" ? errorContent : null}
          </div>
          <div className={errorType === "password" ? `${styles.formBox} ${styles.formError}` : styles.formBox}>
            <Icon className={styles.formBoxIconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onFocus={this.removeFormErrorMessage}
              onChange={e => {
                this.handlePasswordChange(e.currentTarget.value);
                this.checkValidPasswordInput(e.currentTarget.value);
              }}
              placeholder="Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "password" ? (
                {
                  display: "flex",
                }
              ) : null
            }
          >
            {errorType === "password" ? errorContent : null}
          </div>
          <div className={errorType === "repeatPassword" ? `${styles.formBox} ${styles.formError}` : styles.formBox}>
            <Icon className={styles.formBoxIconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onFocus={this.removeFormErrorMessage}
              onChange={e => {
                this.handleRepeatPasswordChange(e.currentTarget.value);
                this.checkValidRepeatPasswordInput(e.currentTarget.value);
              }}
              placeholder="Repeat Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "repeatPassword" ? (
                {
                  display: "flex",
                }
              ) : null
            }
          >
            {errorType === "repeatPassword" ? errorContent : null}
          </div>
          <div className={errorType === "fullName" ? `${styles.formBox} ${styles.formError}` : styles.formBox}>
            <Icon className={styles.formBoxIconWrapper} icon="FULL_NAME_ICON" />
            <div className={styles.separatorLine} />
            <input
              onFocus={this.removeFormErrorMessage}
              onChange={e => {
                this.handleFullNameChange(e.currentTarget.value);
                this.checkValidFullNameInput(e.currentTarget.value);
              }}
              placeholder="Full Name"
              className={`form-control ${styles.inputBox}`}
              type="text"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "fullName" ? (
                {
                  display: "flex",
                }
              ) : null
            }
          >
            {errorType === "fullName" ? errorContent : null}
          </div>
          <div
            onClick={() => {
              this.createNewAccount();
            }}
            className={styles.submitBtn}
          >
            Create New Account
          </div>
          <div className={styles.signInBox}>
            <div className={styles.signInContent}>Already have an account?</div>
            {this.getSignInButton(dialogChangeFunc)}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUp);
