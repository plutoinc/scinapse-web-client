import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { throttle } from "lodash";
import { RouteProps } from "react-router";
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
  routing: RouteProps;
}

interface IHeaderMappedState {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
}

interface IHeaderStates {
  toggled: boolean;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    routing: state.routing,
  };
}

@withRouter
class Header extends React.PureComponent<IHeaderProps, IHeaderStates> {
  public constructor(props: IHeaderProps) {
    super(props);

    this.state = {
      toggled: false,
    };
  }

  public componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    window.addEventListener("click", this.handleToggleMenuContainer);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    window.removeEventListener("click", this.handleToggleMenuContainer);
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

  private handleToggleMenuContainer = (e: any) => {
    // Event Interface doesn't have path property.
    // So I had to use any type.
    const { toggled } = this.state;
    const pathArray: any[] = e.path;
    const pathHasMenuContainer: boolean = pathArray.some((path: any): boolean => {
      const isMenuContainer: boolean =
        typeof path.className === "string" && path.className.search("menuContainer") !== -1;
      return isMenuContainer;
    });

    if (toggled) {
      this.setState(() => ({
        toggled: false,
      }));
    } else if (!toggled && pathHasMenuContainer) {
      this.setState(() => ({
        toggled: true,
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
    const { id, name, email } = this.props.currentUserState;

    if (this.state.toggled) {
      return (
        <div className={styles.dropDownMenuContainer}>
          <div className={styles.userName}>{name}</div>
          <div className={styles.userEmail}>{email}</div>
          <div className={styles.separatorLine} />
          <Link className={styles.dropDownMenuItemWrapper} to={`/users/${id}`}>
            My Page
          </Link>
          <Link className={styles.dropDownMenuItemWrapper} to={`/users/${id}/wallet`}>
            Wallet
          </Link>
          <Link className={styles.dropDownMenuItemWrapper} to={`/users/${id}/setting`}>
            Setting
          </Link>
          <a className={styles.dropDownMenuItemWrapper} onClick={this.handleClickSignOut}>
            Sign out
          </a>
        </div>
      );
    } else {
      return null;
    }
  };

  private getHeaderButton = () => {
    const { currentUserState, routing } = this.props;
    const { isLoggedIn } = currentUserState;
    const notShowSubmitArticleBtn =
      routing.location.pathname === "/articles/new" ||
      routing.location.pathname.search(`/users/${currentUserState.id}`) !== -1;

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
    } else if (notShowSubmitArticleBtn) {
      return (
        <div className={styles.myMenuContainer}>
          <Link className={styles.submitArticleBtn} style={{ visibility: "hidden" }} to="/articles/new">
            Submit Article
          </Link>
          <div className={styles.menuContainer}>
            <div className={styles.avatarButton}>
              <div className={styles.avatarIconWrapper}>
                <Icon icon="AVATAR" />
              </div>
              {this.getArrowPoint()}
            </div>
            {this.getDropdownContainer()}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.myMenuContainer}>
          <Link className={styles.submitArticleBtn} to="/articles/new">
            Submit Article
          </Link>
          <div className={styles.menuContainer}>
            <div className={styles.avatarButton}>
              <div className={styles.avatarIconWrapper}>
                <Icon icon="AVATAR" />
              </div>
              {this.getArrowPoint()}
            </div>
            {this.getDropdownContainer()}
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
