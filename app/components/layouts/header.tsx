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

interface IHeaderStates {
  toggled: boolean;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
  };
}

class Header extends React.PureComponent<IHeaderProps, IHeaderStates> {
  public constructor(props: IHeaderProps) {
    super(props);

    this.state = {
      toggled: false,
    };
  }

  public componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  public componentWillUnmount() {
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

  private handleScroll = throttle(this.handleScrollEvent, 100);

  private handleClickSignOut = () => {
    const { dispatch } = this.props;

    dispatch(signOut());
  };

  private handleToggleMenuContainer = () => {
    const { toggled } = this.state;

    if (!toggled) {
      this.setState(() => ({
        toggled: true,
      }));
    } else {
      this.setState(() => ({
        toggled: false,
      }));
    }
  };

  private getArrowPoint = () => {
    if (!this.state.toggled) {
      return (
        <div className={styles.arrowPointIconWrapper}>
          <Icon icon="ARROW_POINT_TO_DOWN" />
        </div>
      );
    } else {
      return (
        <div className={styles.arrowPointIconWrapper}>
          <Icon icon="ARROW_POINT_TO_UP" />
        </div>
      );
    }
  };

  private getDropdownContainer = () => {
    const { id } = this.props.currentUserState;

    if (this.state.toggled) {
      return (
        <div className={styles.dropDownMenuContainer}>
          <Link onClick={this.handleToggleMenuContainer} className={styles.dropDownMenuItemWrapper} to={`/users/${id}`}>
            My Page
          </Link>
          <div className={styles.separatorLine} />
          <Link
            onClick={this.handleToggleMenuContainer}
            className={styles.dropDownMenuItemWrapper}
            to={`/users/${id}/wallet`}
          >
            Wallet
          </Link>
          <div className={styles.separatorLine} />
          <a
            className={styles.dropDownMenuItemWrapper}
            onClick={() => {
              this.handleClickSignOut();
              this.handleToggleMenuContainer();
            }}
          >
            Sign out
          </a>
        </div>
      );
    } else {
      return null;
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
          <div onClick={this.handleToggleMenuContainer} className={styles.avatarButton}>
            <div className={styles.avatarIconWrapper}>
              <Icon icon="AVATAR" />
            </div>
            <div className={styles.userName}>{currentUserState.get("name")}</div>
            {this.getArrowPoint()}
          </div>
          {this.getDropdownContainer()}
        </div>
      );
    }
  };

  public render() {
    const { layoutState } = this.props;

    return (
      <nav className={layoutState.isTop ? styles.navbar : `${styles.navbar} ${styles.scrolledNavbar}`}>
        <div className={styles.headerContainer}>
          <Link className={styles.headerLogo} to="/">
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
          {this.getHeaderButton()}
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps)(Header);
