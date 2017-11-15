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
import { openSignIn, openSignUp } from "../dialog/actions";
import UserProfileIcon from "../common/userProfileIcon";

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
    let pathHasArrowPoint: boolean = false;

    if (pathArray !== undefined) {
      pathHasArrowPoint = pathArray.some((path: any): boolean => {
        const isArrowPoint: boolean = typeof path.className === "string" && path.className.search("arrowPoint") !== -1;
        return isArrowPoint;
      });
    }

    if (toggled) {
      this.setState(() => ({
        toggled: false,
      }));
    } else if (!toggled && pathHasArrowPoint) {
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

  private handleOpenSignIn = () => {
    const { dispatch } = this.props;

    dispatch(openSignIn());
  };

  private handleOpenSignUp = () => {
    const { dispatch } = this.props;

    dispatch(openSignUp());
  };

  private getHeaderButton = () => {
    const { currentUserState, routing } = this.props;
    const { isLoggedIn, profileImage, id } = currentUserState;
    const notShowSubmitArticleBtn =
      routing.location.pathname === "/articles/new" ||
      routing.location.pathname.search(`/users/${currentUserState.id}`) !== -1;

    if (!isLoggedIn) {
      return (
        <div className={styles.buttonList}>
          <div onClick={this.handleOpenSignIn} className={styles.signInBtn}>
            Sign in
          </div>
          <div onClick={this.handleOpenSignUp} className={styles.signUpBtn}>
            Get Started
          </div>
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
              <Link to={`/users/${id}`}>
                <UserProfileIcon profileImage={profileImage} userId={id} type="small" />
              </Link>
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
              <Link to={`/users/${id}`}>
                <UserProfileIcon profileImage={profileImage} userId={id} type="small" />
              </Link>
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
              <a
                className={styles.menuItem}
                href="https://medium.com/pluto-network/introducing-plutos-proof-of-concept-prototype-41c4b871861b"
                target="_blank"
              >
                ABOUT
              </a>
            </li>
            <li>
              <a className={styles.menuItem} href="https://pluto.network/faq" target="_blank">
                FAQ
              </a>
            </li>
          </ul>
          {this.getHeaderButton()}
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps)(Header);
