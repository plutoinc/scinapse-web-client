import * as React from "react";
import { throttle } from "lodash";
import { RouteProps, Link } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { AppState } from "../../../reducers";
import Icon from "../../../icons";
import { HeaderMappedState } from "../types/header";
import { ICurrentUserRecord } from "../../../model/currentUser";
import { ILayoutStateRecord } from "../records";
import { HOME_PATH, SEARCH_RESULT_PATH } from "../../../routes";
import { IArticleSearchStateRecord } from "../../articleSearch/records";
import { handleSearchPush, changeSearchInput } from "../../articleSearch/actions";
import InputBox from "../../common/inputBox/inputBox";
import { reachScrollTop, leaveScrollTop } from "../actions";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./header.scss");

const HEADER_BACKGROUND_START_HEIGHT = 10;

export interface MobileHeaderProps extends DispatchProp<HeaderMappedState> {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}

function mapStateToProps(state: AppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    routing: state.routing,
    articleSearchState: state.articleSearch,
  };
}

@withStyles<typeof MobileHeader>(styles)
class MobileHeader extends React.PureComponent<MobileHeaderProps, {}> {
  private handleSearchPush = (e: React.FormEvent<HTMLFormElement>) => {
    const { dispatch, articleSearchState } = this.props;
    e.preventDefault();
    dispatch(handleSearchPush(articleSearchState.searchInput));
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(changeSearchInput(searchInput));
  };

  private getSearchFormContainer = () => {
    const { articleSearchState } = this.props;

    return (
      <form
        onSubmit={e => {
          this.handleSearchPush(e);
        }}
        className={styles.searchFormContainer}
      >
        <InputBox
          onChangeFunc={this.changeSearchInput}
          defaultValue={articleSearchState.searchInput}
          placeHolder="Search Paper"
          type="headerSearch"
          className={styles.inputBox}
          onClickFunc={this.handleSearchPush}
        />
      </form>
    );
  };

  private getSearchResultNavbarAtTop = () => {
    return (
      <nav className={styles.searchNavbarTop}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.headerLogoWrapper}>
            <Icon icon="PAPERS_LOGO" />
          </Link>
          <div className={styles.rightBox}>{this.getSignInButton()}</div>
        </div>
        <div className={styles.headerContainer}>{this.getSearchFormContainer()}</div>
      </nav>
    );
  };

  private getSearchResultNavbar = () => {
    const { layoutState } = this.props;

    if (layoutState.isTop) {
      return this.getSearchResultNavbarAtTop();
    } else {
      return (
        <nav className={styles.searchNavbar}>
          <div className={styles.headerContainer}>
            <Link to="/" className={styles.headerLogoWrapper}>
              <Icon icon="SMALL_LOGO" />
            </Link>
            {this.getSearchFormContainer()}
          </div>
        </nav>
      );
    }
  };

  private getSignInButton = () => {
    return <span />;
    // const { currentUserState } = this.props;
    // if (!currentUserState.isLoggedIn) {
    //   return (
    //     <Link className={styles.signInBox} to="/users/sign_in">
    //       Sign in
    //     </Link>
    //   );
    // } else {
    //   return <div className={styles.usernameBox}>{currentUserState.name}</div>;
    // }
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

    if (pathname === HOME_PATH) {
      return this.getHomeHeader();
    } else if (pathname === SEARCH_RESULT_PATH) {
      return this.getSearchResultNavbar();
    } else {
      return null;
    }
  }

  private handleScrollEvent = () => {
    const { dispatch, layoutState } = this.props;
    const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (top < HEADER_BACKGROUND_START_HEIGHT) {
      dispatch(reachScrollTop());
    } else if (layoutState.isTop && top >= HEADER_BACKGROUND_START_HEIGHT) {
      dispatch(leaveScrollTop());
    }
  };

  private handleScroll = throttle(this.handleScrollEvent, 300);
}

export default connect(mapStateToProps)(MobileHeader);
