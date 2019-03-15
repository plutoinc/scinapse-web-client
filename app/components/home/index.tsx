import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import { debounce } from "lodash";
import Helmet from "react-helmet";
import * as Actions from "../articleSearch/actions";
import { AppState } from "../../reducers";
import { Footer } from "../layouts";
import { LayoutState, UserDevice } from "../layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
import { HomeState } from "./records";
import { getKeywordCompletion, clearKeywordCompletion } from "./actions";
import ActionTicketManager from "../../helpers/actionTicketManager";
import SearchQueryInput from "../common/InputWithSuggestionList/searchQueryInput";
// import Icon from "../../icons";
import alertToast from "../../helpers/makePlutoToastAction";
import { trackEvent } from "../../helpers/handleGA";
import PapersQueryFormatter from "../../helpers/papersQueryFormatter";
import {
  getRecentQueries,
  saveQueryToRecentHistory,
  // deleteQueryFromRecentList,
} from "../../helpers/recentQueryManager";
const styles = require("./home.scss");

const MAX_KEYWORD_SUGGESTION_LIST_COUNT = 10;

export interface HomeProps extends RouteComponentProps<null> {
  layout: LayoutState;
  home: HomeState;
  dispatch: Dispatch<any>;
}

interface HomeCompState {
  searchKeyword: string;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    home: state.home,
  };
}

@withStyles<typeof Home>(styles)
class Home extends React.PureComponent<HomeProps, HomeCompState> {
  public constructor(props: HomeProps) {
    super(props);

    this.state = {
      searchKeyword: "",
    };
  }

  public componentDidMount() {
    this.clearSearchInput();
  }

  public componentWillReceiveProps(nextProps: HomeProps) {
    const { dispatch, location } = this.props;

    if (location !== nextProps.location) {
      dispatch(clearKeywordCompletion());
    }
  }

  public componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(clearKeywordCompletion());
  }

  public render() {
    const { layout, home } = this.props;
    const { searchKeyword } = this.state;

    const containerStyle = this.getContainerStyle();
    const searchBoxPlaceHolder =
      layout.userDevice !== UserDevice.DESKTOP
        ? "Search papers by keyword"
        : "Search papers by title, author, doi or keyword";

    const recentQueries = getRecentQueries(searchKeyword).map(q => ({ text: q, removable: true }));
    const suggestionList = home.completionKeywordList
      .filter(k => !getRecentQueries(searchKeyword).includes(k.keyword))
      .map(k => ({ text: k.keyword }));
    const keywordList = [...recentQueries, ...suggestionList].slice(0, MAX_KEYWORD_SUGGESTION_LIST_COUNT);

    return (
      <div className={styles.articleSearchFormContainer}>
        {this.getHelmetNode()}
        <h1 style={{ display: "none" }}>Scinapse | Academic search engine for paper</h1>
        <div className={styles.searchFormInnerContainer}>
          <div className={styles.searchFormContainer}>
            <div className={styles.formWrapper}>
              <div className={styles.searchTitle}>
                <span className={styles.searchTitleText}> Do Research, Never Re-search</span>
                <img src="https://assets.pluto.network/scinapse/circle%403x.png" className={styles.circleImage} />
                <img src="https://assets.pluto.network/scinapse/underline%403x.png" className={styles.underlineImage} />
              </div>
              <div className={styles.searchSubTitle}>
                Scinapse is a free, nonprofit, Academic search engine <br /> for papers, serviced by{" "}
                <a href="https://pluto.network" target="_blank" className={styles.plutoLink} rel="noopener">
                  Pluto Network
                </a>
              </div>
              <div tabIndex={0} className={styles.searchInputForm}>
                <SearchQueryInput />
                {/* <InputWithSuggestionList
                  onChange={this.handleChangeSearchInput}
                  placeholder={searchBoxPlaceHolder}
                  onSubmitQuery={this.handleSearchPush}
                  suggestionList={keywordList}
                  onClickRemoveBtn={q => {
                    deleteQueryFromRecentList(q);
                    this.forceUpdate();
                  }}
                  wrapperStyle={{
                    backgroundColor: "white",
                    borderRadius: "4px",
                  }}
                  style={{
                    display: "flex",
                    width: "100%",
                    border: 0,
                    borderRadius: "4px",
                    lineHeight: 1.5,
                    color: "#1e2a35",
                    backgroundColor: "white",
                    overflow: "hidden",
                    alignItems: "center",
                    padding: "12px 44px 12px 16px",
                  }}
                  listWrapperStyle={{
                    boxShadow: "0 1px 2px 0 #bbc2d0",
                  }}
                  listItemStyle={{
                    height: "44px",
                    lineHeight: "44px",
                    padding: "0 18px",
                  }}
                  iconNode={<Icon icon="SEARCH_ICON" className={styles.searchIcon} />}
                  autoFocus
                  openListAtFocus
                /> */}
              </div>
              <div className={styles.searchTryKeyword} />
            </div>
          </div>
          <div className={styles.featureWrapper}>
            <div className={styles.featureItem}>
              <div className={styles.featureName}>Intuitive Feed</div>
              <div className={styles.featureContents}>
                Quickly skim through the search results with major indices on the authors and the article.
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureName}>Save to Collection</div>
              <div className={styles.featureContents}>
                When you meet interesting papers, just save it to your Collection.
              </div>
            </div>
          </div>
          <div className={styles.sourceVendorContainer}>
            <div className={styles.sourceVendorSubtitle}>Metadata of papers comes from</div>
            <div className={styles.sourceVendorWrapper}>
              <div className={styles.sourceVendorItem}>
                <a href="https://aka.ms/msracad" target="_blank" rel="noopener">
                  <img src="https://assets.pluto.network/scinapse/microsoft-research.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.semanticscholar.org/" target="_blank" rel="noopener">
                  <img src="https://assets.pluto.network/scinapse/semantic-scholar%402x.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.springernature.com/gp/" target="_blank" rel="noopener">
                  <img src="https://assets.pluto.network/scinapse/springernature%402x.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.ncbi.nlm.nih.gov/pubmed/" target="_blank" rel="noopener">
                  <img src="https://assets.pluto.network/scinapse/pubmed%402x.png" />
                </a>
              </div>
            </div>
          </div>
          <Footer containerStyle={containerStyle} />
        </div>
      </div>
    );
  }

  private clearSearchInput = () => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(""));
  };

  private getHelmetNode = () => {
    const structuredDataJSON = {
      "@context": "http://schema.org",
      "@type": "Organization",
      url: "https://scinapse.io",
      logo: "https://s3.amazonaws.com/pluto-asset/scinapse/scinapse-logo.png",
    };

    return <Helmet script={[{ type: "application/ld+json", innerHTML: JSON.stringify(structuredDataJSON) }]} />;
  };

  private handleChangeSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const searchInput = e.currentTarget.value;

    this.setState({
      searchKeyword: searchInput,
    });

    if (searchInput.length > 1) {
      this.delayedGetKeywordCompletion(searchInput);
    }
  };

  private getKeywordCompletion = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(getKeywordCompletion(searchInput));
  };

  // tslint:disable-next-line:member-ordering
  private delayedGetKeywordCompletion = debounce(this.getKeywordCompletion, 200);

  private handleSearchPush = (query: string) => {
    const { history } = this.props;

    if (query.length < 2) {
      return alertToast({
        type: "error",
        message: "You should search more than 2 characters.",
      });
    }

    ActionTicketManager.trackTicket({
      pageType: "home",
      actionType: "fire",
      actionArea: "home",
      actionTag: "query",
      actionLabel: query,
    });

    trackEvent({ category: "Search", action: "Query", label: "" });

    saveQueryToRecentHistory(query);

    history.push(
      `/search?${PapersQueryFormatter.stringifyPapersQuery({
        query,
        sort: "RELEVANCE",
        filter: {},
        page: 1,
      })}`
    );
  };

  private getContainerStyle = (): React.CSSProperties => {
    const { layout } = this.props;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return { position: "absolute", margin: "0 0 9px 0", width: "100%" };
    } else {
      return {};
    }
  };
}

export default withRouter(connect(mapStateToProps)(Home));
