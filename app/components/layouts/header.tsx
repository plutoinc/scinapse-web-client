import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { throttle } from "lodash";
import { RouteProps } from "react-router";
import { parse } from "qs";
import { IAppState } from "../../reducers";
import Icon from "../../icons";
import { ICurrentUserRecord } from "../../model/currentUser";
import { signOut } from "../auth/actions";
import { ILayoutStateRecord } from "./records";
import * as Actions from "./actions";
import { openSignIn, openSignUp } from "../dialog/actions";
import { trackAction } from "../../helpers/handleGA";
import { changeSearchInput, handleSearchPush } from "../articleSearch/actions";
import { IArticleSearchStateRecord } from "../articleSearch/records";
import { InputBox } from "../common/inputBox/inputBox";
import { IArticleSearchSearchParams } from "../articleSearch/types";

const styles = require("./header.scss");
const HEADER_BACKGROUND_START_HEIGHT = 10;

interface IHeaderProps extends DispatchProp<IHeaderMappedState> {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}

interface IHeaderMappedState {
  layoutState: ILayoutStateRecord;
  currentUserState: ICurrentUserRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    routing: state.routing,
    articleSearchState: state.articleSearch,
  };
}

@withRouter
class Header extends React.PureComponent<IHeaderProps, {}> {
  private getCurrentSearchParamsString = () => {
    const { routing } = this.props;
    return routing.location.search;
  };

  private getParsedSearchParamsObject = (searchString: string): IArticleSearchSearchParams => {
    return parse(searchString, { ignoreQueryPrefix: true });
  };

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

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(changeSearchInput(searchInput));
  };

  private handleSearchPush = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(handleSearchPush(articleSearchState.searchInput));
  };

  private getSearchFormContainer = () => {
    const { articleSearchState } = this.props;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams: IArticleSearchSearchParams = this.getParsedSearchParamsObject(searchString);
    const searchQueryParam = searchParams.query;
    const searchReferenceParam = searchParams.references;
    const searchCitedParam = searchParams.cited;

    const isShowSearchFormContainer = !!searchQueryParam || !!searchReferenceParam || !!searchCitedParam;

    return (
      <form
        style={!isShowSearchFormContainer ? { visibility: "hidden" } : null}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          this.handleSearchPush();
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

  private handleClickSignOut = () => {
    const { dispatch } = this.props;

    dispatch(signOut());
  };

  private handleOpenSignIn = () => {
    const { dispatch } = this.props;

    dispatch(openSignIn());
  };

  private handleOpenSignUp = () => {
    const { dispatch } = this.props;

    dispatch(openSignUp());
  };

  private getHeaderButtons = () => {
    const { currentUserState } = this.props;
    const { isLoggedIn } = currentUserState;

    if (!isLoggedIn) {
      return (
        <div className={styles.rightBox}>
          <div onClick={this.handleOpenSignIn} className={styles.signInBtn}>
            Sign in
          </div>
          <div onClick={this.handleOpenSignUp} className={styles.signUpBtn}>
            Get Started
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.rightBox}>
          <a onClick={this.handleClickSignOut} className={styles.signOutBtn}>
            Sign out
          </a>
        </div>
      );
    }
  };

  public componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  public render() {
    const { layoutState } = this.props;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams: IArticleSearchSearchParams = this.getParsedSearchParamsObject(searchString);
    const searchQueryParam = searchParams.query;

    let navClassName;
    if (layoutState.isTop) {
      navClassName = styles.navbar;
    } else {
      navClassName = `${styles.navbar} ${styles.scrolledNavbar}`;
    }

    if (!searchQueryParam) {
      navClassName = `${navClassName} ${styles.searchHomeNavbar}`;
    }

    return (
      <nav className={navClassName}>
        <div className={styles.headerContainer}>
          <Link to="/" onClick={() => trackAction("/", "headerLogo")} className={styles.headerLogo}>
            <Icon icon="PAPERS_LOGO" />
          </Link>
          {this.getSearchFormContainer()}
          {this.getHeaderButtons()}
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps)(Header);
