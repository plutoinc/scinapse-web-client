import * as React from "react";
import { Link } from "react-router-dom";
// redux environment
import { connect } from "react-redux";
import { Dispatch } from "redux";
// actions
import * as Actions from './actions';
// reducer
import { IAppState } from "../../../reducers";
import { ISignInStateManager } from "./reducer";
// styles
const styles = require("./signIn.scss");
// components
import Icon from '../../../icons';

interface ISignInContainerProps {
  dispatch: Dispatch<any>;
  signInState: ISignInStateManager;
}

function mapStateToProps(state: IAppState) {
  return {
    signInState: state.signIn,
  };
}

class SignIn extends React.PureComponent<ISignInContainerProps, {}>  {
  public render() {
    const { signInState } = this.props;
    console.log('signInState is ', signInState);

    return (
      <div className={styles.signInContainer}>
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
              onChange={(e) => {this.handleEmailChange(e.currentTarget.value)}}
              placeholder="E-mail"
              className={`form-control ${styles.inputBox}`}
              type="email"
            />
          </div>
          <div className={styles.formBox}>
            <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={(e) => {this.handlePasswordChange(e.currentTarget.value)}}
              placeholder="Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div onClick={()=> this.signIn()} className={styles.submitBtn}>
            Sign in
          </div>
          <Link className={styles.forgotPassword} to='recovery'>
            Forgot password?
          </Link>
          <div className={styles.orSeparatorBox}>
            <div className={styles.dashedSeparator} />
            <div className={styles.orContent}>or</div>
            <div className={styles.dashedSeparator} />
          </div>
          <Link className={styles.createAccountBtn} to='signup'>
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  handleEmailChange(email:any) {
    const { dispatch } = this.props;
    dispatch(Actions.changeEmailInput(email));
  }
  
  handlePasswordChange(password:any) {
    const { dispatch } = this.props;
    dispatch(Actions.changePasswordInput(password));
  }

  signIn() {
    const { signInState, dispatch } = this.props;
    const userInfo = signInState.getIn(["data", "user"]);
    
    // e-mail empty check
    if (userInfo.get('email') === '') {
      alert("e-mail input is empty");
      return;
    }
  
    // e-mail validation by regular expression
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!reg.test(userInfo.get('email'))) {
      alert("Please input valid e-mail");
      return;
    }
  
    dispatch(Actions.signIn(userInfo));
  }
}

export default connect(
  mapStateToProps,
)(SignIn);
