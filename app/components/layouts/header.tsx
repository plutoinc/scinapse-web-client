import * as React from "react";
import { Link } from "react-router-dom";
// components
import Icon from '../../icons';

const styles = require("./header.scss");

export default class Header extends React.PureComponent<null, null> {
  public render() {
    return (
      <nav className={styles.navbar}>
        <div className={styles.headerContainer}>
          <Link className={styles.logo} to="/" >
            <Icon icon="PLUTO_LOGO" />
          </Link>
          <ul className={styles.menuList}>
            <li>
              <Link className={styles.menuItem} to="/about">
                About
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
              <Link className={styles.signInBtn} to="/user/login">
                Sign in
              </Link>
            </li>
            <li>
              <Link className={styles.loginBtn} to="/user/signin">
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
