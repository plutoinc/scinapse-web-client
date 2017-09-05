import * as React from "react";
import { Link } from "react-router-dom";
// components
import Icon from '../../icons';

const styles = require("./header.scss");

export default class Header extends React.PureComponent<null, null> {
  public render() {
    return (
      <div className={styles.headerContainer}>
        <Link className={styles.logo} to="/" >
          <Icon icon="PLUTO_LOGO" />
        </Link>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/about">About</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/faq">FAQ</Link>
          </li>
        </ul>
      </div>
    );
  }
}
