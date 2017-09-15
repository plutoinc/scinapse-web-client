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
  private dropDownMenu: HTMLDivElement;
  private arrowPointToDown: HTMLDivElement;
  private arrowPointToUp: HTMLDivElement;
  private toggled: boolean = false;

  private getHeaderButton() {
    const { currentUserState } = this.props;
    if (currentUserState.get("nickName") === "") {
      return (
        <div className={styles.buttonList}>
          <Link className={styles.signInBtn} to="/users/sign_in">
            Sign in
          </Link>
          <Link className={styles.signUpBtn} to="/users/sign_up">
            Get Started
          </Link>
        </div>
      );
    } else {
      return (
        <div className={styles.myMenuContainer}>
          <div
            onClick={() => {
              if (!this.toggled) {
                this.dropDownMenu.style.display = "";
                this.arrowPointToDown.style.display = "none";
                this.arrowPointToUp.style.display = "";
                this.toggled = true;
              } else {
                this.dropDownMenu.style.display = "none";
                this.arrowPointToDown.style.display = "";
                this.arrowPointToUp.style.display = "none";
                this.toggled = false;
              }
            }}
            className={styles.avatarButton}
          >
            <div className={styles.avatarIconWrapper}>
              <Icon icon="AVATAR" />
            </div>
            <div className={styles.userName}>
              {currentUserState.get("nickName")}
            </div>
            <div
              className={styles.arrowPointIconWrapper}
              ref={ref => (this.arrowPointToDown = ref)}
            >
              <Icon icon="ARROW_POINT_TO_DOWN" />
            </div>
            <div
              className={styles.arrowPointIconWrapper}
              ref={ref => (this.arrowPointToUp = ref)}
              style={{ display: "none" }}
            >
              <Icon icon="ARROW_POINT_TO_UP" />
            </div>
          </div>
          <div
            className={styles.dropDownMenuContainer}
            ref={ref => (this.dropDownMenu = ref)}
            style={{ display: "none" }}
          >
            <Link
              className={styles.dropDownMenuItemWrapper}
              to="/users/my_page"
            >
              My Page
            </Link>
            <div className={styles.separatorLine} />
            <Link className={styles.dropDownMenuItemWrapper} to="/users/wallet">
              Wallet
            </Link>
            <div className={styles.separatorLine} />
            <Link
              className={styles.dropDownMenuItemWrapper}
              to="/users/sign_out"
            >
              Sign out
            </Link>
          </div>
        </div>
      );
    }
  }
  public render() {
    let headerButton = this.getHeaderButton();

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
