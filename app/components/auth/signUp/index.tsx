import * as React from "react";

const styles = require("./signUp.scss");
import { Link } from "react-router-dom";
// components
import Icon from '../../../icons';

const SignUp = () => {
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
          <Icon className={styles.iconWrapper} icon="FULL_NAME_ICON" />
          <div className={styles.seperatorLine} />
          <input
            placeholder="Full Name"
            className={`form-control ${styles.inputBox}`}
            type="text"
          />
        </div>
        <div className={styles.formBox}>
          <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
          <div className={styles.seperatorLine} />
          <input
            placeholder="Password"
            className={`form-control ${styles.inputBox}`}
            type="password"
          />
        </div>
        <div className={styles.formBox}>
          <Icon className={styles.iconWrapper} icon="PASSWORD_ICON" />
          <div className={styles.seperatorLine} />
          <input
            placeholder="Repeat Password"
            className={`form-control ${styles.inputBox}`}
            type="password"
          />
        </div>
        <div className={styles.formBox}>
          <Icon className={styles.iconWrapper} icon="EMAIL_ICON" />
          <div className={styles.seperatorLine} />
          <input
            placeholder="E-mail (Institution)"
            className={`form-control ${styles.inputBox}`}
            type="email"
          />
        </div>
        <div className={styles.submitBtn}>
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

export default SignUp;
