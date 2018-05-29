import * as React from "react";
import { throttle } from "lodash";
import { RouteProps, Link } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import { AppState } from "../../../reducers";
import Icon from "../../../icons";
import { CurrentUserRecord } from "../../../model/currentUser";
import { LayoutStateRecord } from "../records";
import { HOME_PATH, SEARCH_RESULT_PATH } from "../../../routes";
import { ArticleSearchState } from "../../articleSearch/records";
import { handleSearchPush, changeSearchInput } from "../../articleSearch/actions";
import InputBox from "../../common/inputBox/inputBox";
import { withStyles } from "../../../helpers/withStylesHelper";
import EnvChecker from "../../../helpers/envChecker";
const styles = require("./header.scss");

const HEADER_BACKGROUND_START_HEIGHT = 10;

export interface MobileHeaderProps {
  layoutState: LayoutStateRecord;
  currentUserState: CurrentUserRecord;
  routing: RouteProps;
  articleSearchState: ArticleSearchState;
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    routing: state.routing,
    articleSearchState: state.articleSearch,
  };
}

interface MobileHeaderStates {
  isTop: boolean;
}

@withStyles<typeof MobileHeader>(styles)
class MobileHeader extends React.PureComponent<MobileHeaderProps, MobileHeaderStates> {
  private handleScroll: (() => void) & _.Cancelable;

  public constructor(props: MobileHeaderProps) {
    super(props);

    this.handleScroll = throttle(this.handleScrollEvent, 300);
    this.state = {
      isTop: true,
    };
  }

  public componentDidMount() {
    if (!EnvChecker.isServer()) {
      window.addEventListener("scroll", this.handleScroll);
    }
  }

  public componentWillUnmount() {
    if (!EnvChecker.isServer()) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  public render() {
    const { routing } = this.props;

    const pathname = routing.location!.pathname;

    if (pathname === HOME_PATH) {
      return this.getHomeHeader();
    } else if (pathname === SEARCH_RESULT_PATH) {
      return this.getSearchResultNavbar();
    } else {
      return null;
    }
  }

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
          placeHolder="Search papers by keyword"
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
            <Icon icon="SCINAPSE_LOGO" />
          </Link>
        </div>
        <div className={styles.headerContainer}>{this.getSearchFormContainer()}</div>
      </nav>
    );
  };

  private getSearchResultNavbar = () => {
    if (this.state.isTop) {
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

  private getHomeHeader = () => {
    return (
      <nav className={styles.homeNavbar}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.headerLogoWrapper}>
            <Icon icon="SCINAPSE_LOGO" />
          </Link>
        </div>
      </nav>
    );
  };

  private handleScrollEvent = () => {
    const top = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;

    if (top < HEADER_BACKGROUND_START_HEIGHT) {
      this.setState({
        isTop: true,
      });
    } else if (this.state.isTop && top >= HEADER_BACKGROUND_START_HEIGHT) {
      this.setState({
        isTop: false,
      });
    }
  };
}

export default connect(mapStateToProps)(MobileHeader);
