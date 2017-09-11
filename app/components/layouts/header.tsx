import * as React from "react";
import { Link } from "react-router-dom";
// components
import Icon from "../../icons";

const styles = require("./header.scss");

export default class Header extends React.PureComponent<null, null> {
  public render() {
    return (
      <nav className={styles.navbar}>
        <div className={styles.headerContainer}>
          <Link className={styles.logo} to="/">
            <Icon icon="HEADER_LOGO" />
          </Link>
          <ul className={styles.menuList}>
            <li>
              <Link className={styles.menuItem} to="/about">
                ABOUT
              </Link>
            </li>
            <li>
              <Link className={styles.menuItem} to="/FAQ">
                FAQ
              </Link>
            </li>
          </ul>
          <ul className={styles.buttonList}>
            <li>
              <Link className={styles.signInBtn} to="/users/sign_in">
                Sign in
              </Link>
            </li>
            <li>
              <Link className={styles.signUpBtn} to="/users/sign_up">
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
