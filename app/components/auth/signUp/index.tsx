import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { ISignUpStateRecord } from "./records";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/records";
import ButtonSpinner from "../../common/spinner/buttonSpinner";
import { ICreateNewAccountParams } from "./actions";

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
  private checkDuplicatedEmail = (email: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.checkDuplicatedEmail(email));
  };

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

  private handleNameChange = (name: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeNameInput(name));
  };

  private checkValidNameInput = (name: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.checkValidNameInput(name));
  };

  private removeFormErrorMessage = () => {
    const { dispatch } = this.props;

    dispatch(Actions.removeFormErrorMessage());
  };

  private createNewAccount = () => {
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

  public render() {
    const { signUpState, handleChangeDialogType } = this.props;
    const { errorType, errorContent } = signUpState;
    return (
      <div className={styles.signUpContainer}>
        <div className={styles.formContainer}>
          {this.getAuthNavBar(handleChangeDialogType)}
          <div className={errorType === "email" ? `${styles.formBox} ${styles.formError}` : styles.formBox}>
            <Icon className={styles.formBoxIconWrapper} icon="EMAIL_ICON" />
            <div className={styles.separatorLine} />
            <input
              onFocus={this.removeFormErrorMessage}
              onChange={e => {
                this.handleEmailChange(e.currentTarget.value);
                this.checkValidEmailInput(e.currentTarget.value);
                this.checkDuplicatedEmail(e.currentTarget.value);
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
              errorType === "email"
                ? {
                    display: "flex",
                  }
                : null
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
              errorType === "password"
                ? {
                    display: "flex",
                  }
                : null
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
              errorType === "repeatPassword"
                ? {
                    display: "flex",
                  }
                : null
            }
          >
            {errorType === "repeatPassword" ? errorContent : null}
          </div>
          <div className={errorType === "name" ? `${styles.formBox} ${styles.formError}` : styles.formBox}>
            <Icon className={styles.formBoxIconWrapper} icon="FULL_NAME_ICON" />
            <div className={styles.separatorLine} />
            <input
              onFocus={this.removeFormErrorMessage}
              onChange={e => {
                this.handleNameChange(e.currentTarget.value);
                this.checkValidNameInput(e.currentTarget.value);
              }}
              placeholder="Full Name"
              className={`form-control ${styles.inputBox}`}
              type="text"
            />
          </div>
          <div
            className={styles.errorContent}
            style={
              errorType === "name"
                ? {
                    display: "flex",
                  }
                : null
            }
          >
            {errorType === "name" ? errorContent : null}
          </div>
          {signUpState.isLoading === true ? (
            <div className={styles.loadingSubmitBtn}>
              <div className={styles.buttonSpinner}>
                <ButtonSpinner />
              </div>
              Create New Account
            </div>
          ) : (
            <div
              onClick={() => {
                this.createNewAccount();
              }}
              className={styles.submitBtn}
            >
              Create New Account
            </div>
          )}

          <div className={styles.signInBox}>
            <div className={styles.signInContent}>Already have an account?</div>
            {this.getSignInButton(handleChangeDialogType)}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUp);
