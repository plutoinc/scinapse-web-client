import * as React from "react";
import { Link, withRouter } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { throttle } from "lodash";
import { RouteProps } from "react-router";
import { IAppState } from "../../reducers";
import Icon from "../../icons";
import { ILayoutStateRecord } from "./records";
import * as Actions from "./actions";
import { trackAction } from "../../helpers/handleGA";
import { changeSearchInput, handleSearchPush } from "../articleSearch/actions";
import { IArticleSearchStateRecord } from "../articleSearch/records";
import { InputBox } from "../common/inputBox/inputBox";

const styles = require("./header.scss");
const HEADER_BACKGROUND_START_HEIGHT = 10;

interface IHeaderProps extends DispatchProp<IHeaderMappedState> {
  layoutState: ILayoutStateRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}

interface IHeaderMappedState {
  layoutState: ILayoutStateRecord;
  routing: RouteProps;
  articleSearchState: IArticleSearchStateRecord;
}

interface IHeaderStates {
  toggled: boolean;
}

function mapStateToProps(state: IAppState) {
  return {
    layoutState: state.layout,
    routing: state.routing,
    articleSearchState: state.articleSearch,
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

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(changeSearchInput(searchInput));
  };

  private handleSearchPush = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(handleSearchPush(articleSearchState.searchInput));
  };

  private getSearchFormContainer = () => {
    const { articleSearchState, routing } = this.props;
    const locationSearch = routing.location.search;
    const searchParams = new URLSearchParams(locationSearch);
    const searchQueryParam = searchParams.get("query");

    const notShowSearchFormContainer =
      routing.location.pathname === "/" || searchQueryParam === "" || !searchQueryParam;

    if (!notShowSearchFormContainer) {
      return (
        <form onSubmit={this.handleSearchPush} className={styles.searchFormContainer}>
          <InputBox
            onChangeFunc={this.changeSearchInput}
            defaultValue={articleSearchState.searchInput}
            placeHolder="Search Paper"
            type="headerSearch"
            className={styles.inputBox}
          />
        </form>
      );
    }
  };

  public render() {
    const { layoutState } = this.props;

    return (
      <nav className={layoutState.isTop ? styles.navbar : `${styles.navbar} ${styles.scrolledNavbar}`}>
        <div className={styles.headerContainer}>
          <Link to="/" onClick={() => trackAction("/", "headerLogo")} className={styles.headerLogo}>
            <Icon icon="HEADER_LOGO" />
          </Link>
          {this.getSearchFormContainer()}
        </div>
      </nav>
    );
  }
}

export default connect(mapStateToProps)(Header);
