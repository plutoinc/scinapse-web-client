import * as React from "react";
import { Link } from "react-router-dom";

export default class Header extends React.PureComponent<null, null> {
  public render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <div className="collapse navbar-collapse justify-content-end" id="main-navbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">HOME</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/user/signin">Sign In</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
