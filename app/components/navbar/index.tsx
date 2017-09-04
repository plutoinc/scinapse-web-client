import * as React from "react";
import { Link } from "react-router-dom";

export default class NavbarComponent extends React.PureComponent<null, null> {
  public render() {
    return (
      <nav className="navbar navbar-toggleable-md navbar-inverse bg-inverse">
        <div className="collapse navbar-collapse justify-content-end" id="main-navbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">HOME</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/auth/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/auth/signIn">sing In</Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}
