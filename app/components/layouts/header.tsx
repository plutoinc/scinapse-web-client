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
          <div className={styles.buttonList}>
            <div className={styles.signInBtn}>
              <Link to="/user/login">
                Sign in
              </Link>
            </div>
            <div className={styles.loginBtn}>
              <Link to="/user/signin">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}
