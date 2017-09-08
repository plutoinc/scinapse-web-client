import * as React from "react";
// redux environment
import { connect } from "react-redux";
import { Dispatch } from "redux";
// actions
import * as Actions from './actions';
// reducer
import { IAppState } from "../../../reducers";
import { ISignUpStateManager } from "./reducer";
const styles = require("./signUp.scss");
import { Link } from "react-router-dom";
// components
import Icon from '../../../icons';

interface ISignUpContainerProps {
  dispatch: Dispatch<any>;
  signUpState: ISignUpStateManager;
}

function mapStateToProps(state: IAppState) {
  return {
    signUpState: state.signUp,
  };
}

class SignUp extends React.PureComponent<ISignUpContainerProps, {}> {
  public render() {
    const { signUpState } = this.props;
    console.log('signUpState is ', signUpState);
    
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
              onChange={(e) => {this.handleEmailChange(e.currentTarget.value)}}
              placeholder="E-mail (Institution)"
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
          <div className={styles.formBox}>
            <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={(e) => {this.handleRepeatPasswordChange(e.currentTarget.value)}}
              placeholder="Repeat Password"
              className={`form-control ${styles.inputBox}`}
              type="password"
            />
          </div>
          <div className={styles.formBox}>
            <Icon className={styles.iconWrapper} icon="FULL_NAME_ICON" />
            <div className={styles.separatorLine} />
            <input
              onChange={(e) => {this.handleFullNameChange(e.currentTarget.value)}}
              placeholder="Full Name"
              className={`form-control ${styles.inputBox}`}
              type="text"
            />
          </div>
          <div 
            onClick={()=> {this.createNewAccount()}}
            className={styles.submitBtn}
            >
            Create New Account
          </div>
          <div className={styles.signInBox}>
            <div className={styles.signInContent}>
              Already have an account? 
            </div>
            <Link className={styles.signInBtn} to="signin">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    )
  }

  handleEmailChange(email:any) {
    const { dispatch } = this.props;
    dispatch(Actions.changeEmailInput(email));
  }
  
  handlePasswordChange(password:any) {
    const { dispatch } = this.props;
    dispatch(Actions.changePasswordInput(password));
  }

  handleRepeatPasswordChange(password:any) {
    const { dispatch } = this.props;
    dispatch(Actions.changeRepeatPasswordInput(password));
  }

  handleFullNameChange(fullName:any) {
    const { dispatch } = this.props;
    dispatch(Actions.changeFullNameInput(fullName));
  }

  createNewAccount() {
    const { signUpState, dispatch } = this.props;
    const userInfo = signUpState.getIn(["data", "user"]);
    
    dispatch(Actions.createNewAccount(userInfo));
  }
}

export default connect(
  mapStateToProps,
)(SignUp);
