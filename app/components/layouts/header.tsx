import * as React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { IAppState } from "../../reducers";
import Icon from "../../icons";
import { ICurrentUserStateRecord } from "../../model/currentUser";

const styles = require("./header.scss");

export interface IHeaderProps {
  currentUserState: ICurrentUserStateRecord;
}
function mapStateToProps(state: IAppState) {
  return {
    currentUserState: state.currentUser
  };
}

class Header extends React.PureComponent<IHeaderProps, {}> {
  private dropDownMenu: any;

  public render() {
    const { currentUserState } = this.props;
    let headerButton = null;
    if (currentUserState.get("email") !== "") {
      headerButton = (
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
      );
    } else {
      headerButton = (
        <div className={styles.myMenuContainer}>
          <div
            onClick={() => {
              if (this.dropDownMenu.style.display === "") {
                this.dropDownMenu.style.display = "none";
              } else {
                this.dropDownMenu.style.display = "";
              }
            }}
            className={styles.avatarButton}
          >
            <div className={styles.avatarIconWrapper}>
              <Icon icon="AVATAR" />
            </div>
            myName
          </div>
          <div
            className={styles.dropDownMenuContainer}
            ref={ref => (this.dropDownMenu = ref)}
          >
            <Link
              className={styles.dropDownMenuItemWrapper}
              to="/users/my_page"
            >
              My Page
            </Link>

            <div className={styles.dropDownMenuItemWrapper}>
              <Link to="/users/wallet">Wallet</Link>
            </div>
            <div className={styles.dropDownMenuItemWrapper}>
              <Link className={styles.dropDownMenuItem} to="/users/sign_out">
                Sign out
              </Link>
            </div>
          </div>
        </div>
      );
    }

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
          {headerButton}
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps)(Header);
