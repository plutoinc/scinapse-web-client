import * as React from "react";
import { throttle } from "lodash";
import { Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { RouteProps } from "react-router-dom";
import { IAppState } from "../../../reducers";
import Icon from "../../../icons";
import { IHeaderMappedState } from "../types/header";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { ILayoutStateRecord } from "../records";
import { HOME_PATH } from "../../../routes";
const styles = require("./header.scss");

// const HEADER_BACKGROUND_START_HEIGHT = 10;

export interface MobileHeaderProps extends DispatchProp<IHeaderMappedState> {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    routing: state.routing,
  };
}

class MobileHeader extends React.PureComponent<MobileHeaderProps, {}> {
  private getSignInButton = () => {
    const { currentUserState } = this.props;

    if (!currentUserState.isLoggedIn) {
      return (
        <Link className={styles.signInBox} to="/users/sign_in">
          Sign in
        </Link>
      );
    } else {
      return <div className={styles.usernameBox}>{currentUserState.name}</div>;
    }
  };

  private getHomeHeader = () => {
    return (
      <nav className={styles.homeNavbar}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.headerLogoWrapper}>
            <Icon icon="PAPERS_LOGO" />
          </Link>
          <div className={styles.rightBox}>{this.getSignInButton()}</div>
        </div>
      </nav>
    );
  };

  public componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  public render() {
    const { routing } = this.props;

    const pathname = routing.location.pathname;

    console.log(pathname === HOME_PATH, "pathname === HOME_PATH");
    if (pathname === HOME_PATH) {
      return this.getHomeHeader();
    } else {
      return (
        <nav className={""}>
          <div className={styles.headerContainer}>
            <Link to="/" className={styles.headerLogo}>
              <Icon icon="PAPERS_LOGO" />
            </Link>
          </div>
        </nav>
      );
    }
  }

  private handleScrollEvent = () => {
    // const { dispatch } = this.props;
    // const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
    // if (top < HEADER_BACKGROUND_START_HEIGHT) {
    //   dispatch(Actions.reachScrollTop());
    // } else {
    //   dispatch(Actions.leaveScrollTop());
    // }
  };

  private handleScroll = throttle(this.handleScrollEvent, 100);
}

export default connect(mapStateToProps)(MobileHeader);
