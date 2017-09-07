import * as React from "react";

const styles = require("./signIn.scss");
import { Link } from "react-router-dom";
// components
import Icon from '../../../icons';

const SignIn = () => {
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
            placeholder="E-mail"
            className={`form-control ${styles.inputBox}`}
            type="email"
          />
        </div>
        <div className={styles.formBox}>
          <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
          <div className={styles.separatorLine} />
          <input
            placeholder="Password"
            className={`form-control ${styles.inputBox}`}
            type="password"
          />
        </div>
        <div className={styles.submitBtn}>
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
    
  )
}

export default SignIn;
