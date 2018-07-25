import * as React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { connect, Dispatch } from "react-redux";
import { AppState } from "../../../reducers";
import Icon from "../../../icons";
import { CurrentUser } from "../../../model/currentUser";
import { LayoutState } from "../records";
import { HOME_PATH, SEARCH_RESULT_PATH } from "../../../routes";
import { ArticleSearchState } from "../../articleSearch/records";
import { handleSearchPush, changeSearchInput } from "../../articleSearch/actions";
import InputBox from "../../common/inputBox/inputBox";
import { withStyles } from "../../../helpers/withStylesHelper";
import EnvChecker from "../../../helpers/envChecker";
const styles = require("./header.scss");

export interface MobileHeaderProps extends RouteComponentProps<any> {
  layoutState: LayoutState;
  currentUserState: CurrentUser;
  articleSearchState: ArticleSearchState;
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    currentUserState: state.currentUser,
    layoutState: state.layout,
    articleSearchState: state.articleSearch,
  };
}

@withStyles<typeof MobileHeader>(styles)
class MobileHeader extends React.PureComponent<MobileHeaderProps> {
  private handleScroll: (() => void) & _.Cancelable;

  public constructor(props: MobileHeaderProps) {
    super(props);
    this.state = {
      isTop: true,
    };
  }

  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      window.addEventListener("scroll", this.handleScroll);
    }
  }

  public componentWillUnmount() {
    if (!EnvChecker.isOnServer()) {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  public render() {
    const { location } = this.props;

    const pathname = location.pathname;

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

  private getSearchResultNavbar = () => {
    return (
      <nav className={styles.searchNavbar}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.headerLogoWrapper}>
            <Icon icon="SCINAPSE_LOGO_SMALL" />
          </Link>
          {this.getSearchFormContainer()}
        </div>
      </nav>
    );
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
}

export default withRouter(connect(mapStateToProps)(MobileHeader));
