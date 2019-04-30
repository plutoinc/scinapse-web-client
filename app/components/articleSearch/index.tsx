import * as React from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { AppState } from "../../reducers";
import * as Actions from "./actions";
import SearchList from "./components/searchList";
import FilterContainer from "../../containers/filterContainer";
import NoResult from "./components/noResult";
import PapersQueryFormatter from "../../helpers/papersQueryFormatter";
import formatNumber from "../../helpers/formatNumber";
import { ArticleSearchContainerProps } from "./types";
import { Footer } from "../layouts";
import DesktopPagination from "../common/desktopPagination";
import MobilePagination from "../common/mobilePagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { getSearchData } from "./sideEffect";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import { UserDevice } from "../layouts/records";
import AuthorSearchItem from "../authorSearchItem";
import restoreScroll from "../../helpers/scrollRestoration";
import { ChangeRangeInputParams } from "../../constants/paperSearch";
import ErrorPage from "../error/errorPage";
import NoResultInSearch from "./components/noResultInSearch";
import TabNavigationBar from "../common/tabNavigationBar";
import SortBar from "./components/SortBar";
import { getUrlDecodedQueryParamsObject } from "../../helpers/makeNewFilterLink";
import { Paper } from "../../model/paper";
import EnvChecker from "../../helpers/envChecker";
import ActionTicketManager from "../../helpers/actionTicketManager";
import DoiSearchBlocked from "./components/doiSearchBlocked";
import { DOI_SEARCH_TEST_NAME } from "../../constants/abTestGlobalValue";
import { getUserGroupName } from "../../helpers/abTestHelper";
const styles = require("./articleSearch.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
    currentUserState: state.currentUser,
    configuration: state.configuration,
  };
}

interface ArticleSearchState {
  isClient: boolean;
}

@withStyles<typeof ArticleSearch>(styles)
class ArticleSearch extends React.PureComponent<ArticleSearchContainerProps, ArticleSearchState> {
  private cancelToken = axios.CancelToken.source();

  public constructor(props: ArticleSearchContainerProps) {
    super(props);

    this.state = {
      isClient: false,
    };
  }

  public async componentDidMount() {
    const { configuration, dispatch, match, location, articleSearchState } = this.props;

    this.setState({ isClient: true });
    this.fetchFilters();

    const notRenderedAtServerOrJSAlreadyInitialized =
      !configuration.succeedAPIFetchAtServer || configuration.renderedAtClient;
    if (notRenderedAtServerOrJSAlreadyInitialized) {
      const currentParams = {
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: getQueryParamsObject(location.search),
        cancelToken: this.cancelToken.token,
      };

      const papers = await getSearchData(currentParams);
      // TODO: change logging logic much easier after chainging the class component to React hooks.
      this.logSearchResult(papers);
      restoreScroll(location.key);
    } else {
      // TODO: change logging logic much easier after chainging the class component to React hooks.
      this.logSearchResult(articleSearchState.searchItemsToShow);
    }
  }

  public async componentDidUpdate(prevProps: ArticleSearchContainerProps) {
    const { dispatch, match, location, currentUserState } = this.props;
    const { isClient } = this.state;

    const prevLocation = prevProps.location;
    const beforeSearch = prevLocation.search;
    const afterSearch = location.search;

    const hasSearchKeywordChanged = !!afterSearch && beforeSearch !== afterSearch;
    const hasAuthStateChanged = currentUserState.isLoggedIn !== prevProps.currentUserState.isLoggedIn;

    if (hasSearchKeywordChanged || hasAuthStateChanged) {
      if (isClient) {
        this.fetchFilters();
      }

      this.cancelToken.cancel();
      this.cancelToken = axios.CancelToken.source();

      const papers = await getSearchData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: getQueryParamsObject(afterSearch),
        cancelToken: this.cancelToken.token,
      });
      if (!hasAuthStateChanged) {
        this.logSearchResult(papers);
      }
      restoreScroll(location.key);
    }
  }

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { articleSearchState, currentUserState, location } = this.props;
    const queryParams = getUrlDecodedQueryParamsObject(location);

    if (articleSearchState.pageErrorCode) {
      return <ErrorPage errorNum={articleSearchState.pageErrorCode} />;
    }

    return (
      <div className={styles.rootWrapper}>
        <TabNavigationBar searchKeyword={articleSearchState.searchInput} />
        <div className={styles.articleSearchContainer}>
          {this.getResultHelmet(queryParams.query)}
          {this.getSuggestionKeywordBox()}
          {this.isFilterEmpty(queryParams.filter) ? this.getAuthorEntitiesSection() : null}
          {this.getInnerContainerContent()}
          <FilterContainer
            handleChangeRangeInput={this.setRangeInput}
            articleSearchState={articleSearchState}
            currentUserState={currentUserState}
            handleToggleExpandingFilter={this.handleToggleExpandingFilter}
          />
        </div>
        <Footer containerStyle={this.getContainerStyle()} />
      </div>
    );
  }

  private logSearchResult = (searchResult?: Paper[] | null) => {
    if (!EnvChecker.isOnServer()) {
      if (!searchResult || searchResult.length === 0) {
        ActionTicketManager.trackTicket({
          pageType: "searchResult",
          actionType: "view",
          actionArea: "paperList",
          actionTag: "pageView",
          actionLabel: String(0),
        });
      } else {
        ActionTicketManager.trackTicket({
          pageType: "searchResult",
          actionType: "view",
          actionArea: "paperList",
          actionTag: "pageView",
          actionLabel: String(searchResult.length),
        });
      }
    }
  };

  private fetchFilters = () => {
    const { dispatch, currentUserState } = this.props;

    if (currentUserState.isLoggedIn) {
      dispatch(Actions.fetchCurrentUserFilters());
    }
  };

  private getInnerContainerContent = () => {
    const { articleSearchState, currentUserState, location } = this.props;
    const { isContentLoading, totalElements, searchItemsToShow } = articleSearchState;

    const queryParams = getUrlDecodedQueryParamsObject(location);

    const hasNoSearchResult =
      (!articleSearchState.searchItemsToShow || articleSearchState.searchItemsToShow.length === 0) && queryParams;

    const hasNoSearchResultAndNoAuthorResult =
      hasNoSearchResult &&
      (!articleSearchState.matchAuthors ||
        (articleSearchState.matchAuthors && articleSearchState.matchAuthors.totalElements === 0));

    const hasNoSearchResultButHasAuthorResult =
      hasNoSearchResult && articleSearchState.matchAuthors && articleSearchState.matchAuthors.totalElements > 0;

    const userGroupName: string = getUserGroupName(DOI_SEARCH_TEST_NAME) || "";

    const blockedDoiMatchedSearch =
      !currentUserState.isLoggedIn && articleSearchState.doiPatternMatched && userGroupName === "block";

    if (hasNoSearchResultButHasAuthorResult) {
      return (
        <div className={styles.innerContainer}>
          <NoResultInSearch
            searchText={queryParams.query}
            otherCategoryCount={articleSearchState.totalElements}
            type="paper"
          />
        </div>
      );
    } else if (hasNoSearchResultAndNoAuthorResult) {
      return (
        <div className={styles.innerContainer}>
          <NoResult
            isLoading={isContentLoading}
            searchText={
              articleSearchState.suggestionKeyword.length > 0 ? articleSearchState.suggestionKeyword : queryParams.query
            }
            articleSearchState={articleSearchState}
            hasEmptyFilter={this.isFilterEmpty(queryParams.filter)}
          />
        </div>
      );
    } else if (blockedDoiMatchedSearch) {
      return (
        <div className={styles.innerContainer}>
          <DoiSearchBlocked isLoading={isContentLoading} searchDoi={articleSearchState.doi} />
        </div>
      );
    } else if (queryParams) {
      return (
        <div className={styles.innerContainer}>
          <div className={styles.searchSummary}>
            <div>
              <span className={styles.categoryHeader}>Publication</span>
              <span className={styles.categoryCount}>{formatNumber(totalElements)}</span>
            </div>
            <SortBar query={queryParams.query} sortOption={queryParams.sort} filter={queryParams.filter} />
          </div>
          <SearchList
            currentUser={currentUserState}
            papers={searchItemsToShow}
            isLoading={isContentLoading}
            searchQueryText={articleSearchState.suggestionKeyword || queryParams.query}
            currentPage={articleSearchState.page}
          />
          {this.getPaginationComponent()}
        </div>
      );
    } else {
      return null;
    }
  };

  private isFilterEmpty = (filter: any) => {
    const keys = Object.keys(filter);
    for (const key of keys) {
      if (typeof filter[key] === "number" && !isNaN(filter[key])) {
        return false;
      } else if (typeof filter[key] === "object" && filter[key].length !== 0) {
        return false;
      }
    }
    return true;
  };

  private getSuggestionKeywordBox = () => {
    const { articleSearchState, location } = this.props;
    const queryParams = getUrlDecodedQueryParamsObject(location);

    if (articleSearchState.searchFromSuggestion) {
      return (
        <div className={styles.suggestionBox}>
          <div className={styles.noResult}>
            {`No result found for `}
            <b>{queryParams.query}</b>
          </div>
          <div className={styles.suggestionResult}>
            {`Showing results for `}
            <Link
              to={{
                pathname: "/search",
                search: PapersQueryFormatter.stringifyPapersQuery({
                  query: articleSearchState.suggestionKeyword,
                  sort: "RELEVANCE",
                  filter: {},
                  page: 1,
                }),
              }}
            >
              <b>{articleSearchState.suggestionKeyword}</b>
            </Link>
          </div>
        </div>
      );
    }

    if (articleSearchState.suggestionKeyword) {
      return (
        <div className={styles.suggestionBox}>
          <span>{`Did you mean `}</span>
          <Link
            to={{
              pathname: "/search",
              search: PapersQueryFormatter.stringifyPapersQuery({
                query: articleSearchState.suggestionKeyword,
                sort: "RELEVANCE",
                filter: {},
                page: 1,
              }),
            }}
            className={styles.suggestionLink}
          >
            <b>{articleSearchState.suggestionKeyword}</b>
          </Link>
          <span>{` ?`}</span>
        </div>
      );
    } else {
      return null;
    }
  };

  private getAuthorEntitiesSection = () => {
    const { articleSearchState } = this.props;
    const matchAuthorEntities = articleSearchState.matchAuthors;

    if (matchAuthorEntities && matchAuthorEntities.content.length > 0 && articleSearchState.page === 1) {
      const matchAuthorCount = matchAuthorEntities.totalElements;
      const matchAuthorContent = matchAuthorEntities.content;
      const moreAuthorPage = (
        <Link
          to={{
            pathname: "/search/authors",
            search: PapersQueryFormatter.stringifyPapersQuery({
              query: articleSearchState.searchInput,
              sort: "RELEVANCE",
              filter: {},
              page: 1,
            }),
          }}
          className={styles.moreAuthorLink}
        >
          Show All Author Results >
        </Link>
      );

      const authorItems = matchAuthorContent.slice(0, 2).map(matchEntity => {
        return <AuthorSearchItem authorEntity={matchEntity} key={matchEntity.id} />;
      });

      return (
        <div className={styles.authorItemSectionWrapper}>
          <div className={styles.authorItemsHeader}>
            <span className={styles.categoryHeader}>Author</span>
            <span className={styles.categoryCount}>{matchAuthorCount}</span>
            {matchAuthorCount <= 2 ? null : moreAuthorPage}
          </div>
          <div className={styles.authorItemsWrapper}>{authorItems}</div>
        </div>
      );
    }

    return null;
  };

  private getResultHelmet = (query: string) => {
    return (
      <Helmet>
        <title>{`${query} | Scinapse | Academic search engine for paper`}</title>
      </Helmet>
    );
  };

  private getContainerStyle = (): React.CSSProperties => {
    const { layout } = this.props;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return { position: "absolute", width: "100", bottom: "unset" };
    } else {
      return { position: "absolute", left: "0", right: "0", bottom: "0" };
    }
  };

  private getPaginationComponent = () => {
    const { articleSearchState, layout } = this.props;
    const { page, totalPages } = articleSearchState;

    const currentPageIndex: number = page - 1;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return (
        <MobilePagination
          totalPageCount={totalPages}
          currentPageIndex={currentPageIndex}
          getLinkDestination={this.makePaginationLink}
          wrapperStyle={{
            margin: "12px 0",
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type="search_result_papers"
          totalPage={totalPages}
          currentPageIndex={currentPageIndex}
          getLinkDestination={this.makePaginationLink}
          wrapperStyle={{
            margin: "24px 0",
          }}
        />
      );
    }
  };

  private handleToggleExpandingFilter = () => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleExpandingFilter());
  };

  private makePaginationLink = (page: number) => {
    const { location } = this.props;

    const queryParamsObject = getUrlDecodedQueryParamsObject(location);
    const queryParams = PapersQueryFormatter.stringifyPapersQuery({
      ...queryParamsObject,
      page,
    });

    return `/search?${queryParams}`;
  };

  private setRangeInput = (params: ChangeRangeInputParams) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeRangeInput(params));
  };
}
export default withRouter(connect(mapStateToProps)(ArticleSearch));
