import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import * as Actions from "./actions";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { ISignUpStateRecord } from "./records";
const styles = require("./signUp.scss");

interface ISignUpContainerProps {
  dispatch: Dispatch<any>;
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

  private handlePasswordChange = (password: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changePasswordInput(password));
  };

  private handleRepeatPasswordChange = (password: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeRepeatPasswordInput(password));
  };

  private handleFullNameChange = (fullName: string) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeFullNameInput(fullName));
  };

  private createNewAccount = () => {
    const { signUpState, dispatch } = this.props;
    const { email, password, repeatPassword, fullName } = signUpState;

    // e-mail empty check
    if (email === "" || email.length <= 0) {
      alert("e-mail input is empty");
      return;
    }

    // e-mail validation by regular expression
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(email)) {
      alert("Please input valid e-mail");
      return;
    }

    // password Validation
    if (password !== repeatPassword) {
      alert("Please same password");
      return;
    }

    dispatch(
      Actions.createNewAccount({
        email,
        password,
        fullName,
      }),
    );
  };

  public render() {
    const { signUpState } = this.props;
    console.log("signUpState is ", signUpState);

    return (
      <div className={styles.signUpContainer}>
        <div className={styles.formContainer}>
          <div className={styles.authNavBar}>
            <Link className={styles.signInLink} to="signin">
              Sign in
            </Link>
            <Link className={styles.signUpLink} to="signup">
              Sign up
            </Link>
          </div>
          <div className={styles.formBox}>
            <Icon className={styles.iconWrapper} icon="EMAIL_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handleEmailChange(e.currentTarget.value);
              }}
              placeholder="E-mail (Institution)"
              className={`form-control ${styles.inputBox}`}
              type="email"
            />
          </div>
          <div className={styles.formBox}>
            <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handlePasswordChange(e.currentTarget.value);
              }}
              placeholder="Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div className={styles.formBox}>
            <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handleRepeatPasswordChange(e.currentTarget.value);
              }}
              placeholder="Repeat Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div className={styles.formBox}>
            <Icon className={styles.iconWrapper} icon="FULL_NAME_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={e => {
                this.handleFullNameChange(e.currentTarget.value);
              }}
              placeholder="Full Name"
              className={`form-control ${styles.inputBox}`}
              type="text"
            />
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
            <Link className={styles.signInBtn} to="signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(SignUp);
