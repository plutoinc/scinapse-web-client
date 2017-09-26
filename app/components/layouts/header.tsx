import * as React from "react";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { throttle } from "lodash";

import { IAppState } from "../../reducers";
import Icon from "../../icons";
import { ICurrentUserRecord } from "../../model/currentUser";
import { signOut } from "../auth/actions";
import { ILayoutStateRecord } from "./records";
import * as Actions from "./actions";

const styles = require("./header.scss");
const HEADER_BACKGROUND_START_HEIGHT = 10;

interface IHeaderProps extends DispatchProp<IHeaderMappedState> {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
}

interface IHeaderMappedState {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
  };
}

class Header extends React.PureComponent<IHeaderProps, {}> {
  private dropDownMenu: HTMLDivElement;
  private arrowPointToDown: HTMLDivElement;
  private arrowPointToUp: HTMLDivElement;
  private toggled: boolean = false;

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.handleScrollEvent();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  private handleScrollEvent = () => {
    const { dispatch } = this.props;
    const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (top < HEADER_BACKGROUND_START_HEIGHT) {
      dispatch(Actions.reachScrollTop());
    } else {
      dispatch(Actions.leaveScrollTop());
    }
  };

  private handleScroll = throttle(this.handleScrollEvent, 50);

  private handleClickSignOut = () => {
    const { dispatch } = this.props;

    dispatch(signOut());
  };

  private getHeaderLogo = () => {
    const { currentUserState } = this.props;
    const { isLoggedIn } = currentUserState;

    if (!isLoggedIn) {
      return (
        <Link className={styles.notSignedInHeaderLogo} to="/">
          <Icon icon="NOT_SIGNED_IN_HEADER_LOGO" />
        </Link>
      );
    } else {
      return (
        <Link className={styles.signedInHeaderLogo} to="/">
          <Icon icon="SIGNED_IN_HEADER_LOGO" />
        </Link>
      );
    }
  };

  private getHeaderButton = () => {
    const { currentUserState } = this.props;
    const { isLoggedIn } = currentUserState;

    if (!isLoggedIn) {
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
            <div className={styles.userName}>{currentUserState.get("nickName")}</div>
            <div className={styles.arrowPointIconWrapper} ref={ref => (this.arrowPointToDown = ref)}>
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
            <Link className={styles.dropDownMenuItemWrapper} to="/users/my_page">
              My Page
            </Link>
            <div className={styles.separatorLine} />
            <Link className={styles.dropDownMenuItemWrapper} to="/users/wallet">
              Wallet
            </Link>
            <div className={styles.separatorLine} />
            <a className={styles.dropDownMenuItemWrapper} onClick={this.handleClickSignOut}>
              Sign out
            </a>
          </div>
        </div>
      );
    }
  };

  public render() {
    const { layoutState } = this.props;

    return (
      <nav className={layoutState.isTop ? styles.navbar : `${styles.navbar} ${styles.scrolledNavbar}`}>
        <div className={styles.headerContainer}>
          {this.getHeaderLogo()}
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
          {this.getHeaderButton()}
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps)(Header);
