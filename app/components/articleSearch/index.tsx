import * as React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { isEqual } from "lodash";
import { AppState } from "../../reducers";
import * as Actions from "./actions";
import SearchList from "./components/searchList";
import ArticleSpinner from "../common/spinner/articleSpinner";
import SortBox from "./components/sortBox";
import FilterContainer from "./components/filterContainer";
import NoResult from "./components/noResult";
import PapersQueryFormatter, { SearchPageQueryParamsObject, FilterObject } from "../../helpers/papersQueryFormatter";
import formatNumber from "../../helpers/formatNumber";
import { ArticleSearchContainerProps } from "./types";
import { Footer } from "../layouts";
import DesktopPagination from "../common/desktopPagination";
import MobilePagination from "../common/mobilePagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { getSearchData } from "./sideEffect";
import SafeURIStringHandler from "../../helpers/safeURIStringHandler";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
import { UserDevice } from "../layouts/records";
import { SEARCH_SORT_OPTIONS } from "./records";
const styles = require("./articleSearch.scss");

interface RawQueryParams {
  query: string;
  filter: string;
  page: string;
  sort: SEARCH_SORT_OPTIONS;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
    currentUserState: state.currentUser,
    configuration: state.configuration,
  };
}

@withStyles<typeof ArticleSearch>(styles)
class ArticleSearch extends React.PureComponent<ArticleSearchContainerProps, {}> {
  public componentDidMount() {
    const { articleSearchState, dispatch, match, location } = this.props;
    const currentParams = {
      dispatch,
      match,
      pathname: location.pathname,
      queryParams: getQueryParamsObject(location.search),
    };

    const beforeParams = JSON.parse(articleSearchState.lastSucceededParams);
    const hasSameResult = isEqual(currentParams.queryParams, beforeParams);

    if (!hasSameResult) {
      getSearchData(currentParams);
    }
  }

  public async componentWillReceiveProps(nextProps: ArticleSearchContainerProps) {
    const { dispatch, match, location } = this.props;
    const beforeSearch = location.search;
    const afterSearch = nextProps.location.search;

    if (!!afterSearch && beforeSearch !== afterSearch) {
      getSearchData({
        dispatch,
        match,
        pathname: nextProps.location.pathname,
        queryParams: getQueryParamsObject(afterSearch),
      });
    }
  }

  public render() {
    const { articleSearchState, currentUserState } = this.props;
    const { isLoading, totalElements, totalPages, searchItemsToShow } = articleSearchState;
    const queryParams = this.getUrlDecodedQueryParamsObject();

    const hasNoSearchResult =
      !articleSearchState.searchItemsToShow || articleSearchState.searchItemsToShow.length === 0;

    if (isLoading) {
      return this.renderLoadingSpinner();
    } else if (hasNoSearchResult && queryParams) {
      return <NoResult searchText={queryParams.query} articleSearchState={articleSearchState} />;
    } else if (queryParams && articleSearchState.aggregationData) {
      return (
        <div className={styles.rootWrapper}>
          <div className={styles.articleSearchContainer}>
            {this.getResultHelmet(queryParams.query)}
            <div className={styles.innerContainer}>
              <div className={styles.searchSummary}>
                <span className={styles.searchPage}>
                  {articleSearchState.page} page of {formatNumber(totalPages)} pages ({formatNumber(totalElements)}{" "}
                  results)
                </span>
                <SortBox query={queryParams.query} sortOption={queryParams.sort} />
              </div>
              {this.getSuggestionKeywordBox()}
              <SearchList
                currentUser={currentUserState}
                papers={searchItemsToShow}
                searchQueryText={queryParams.query}
              />
              {this.getPaginationComponent()}
            </div>
            <FilterContainer
              makeNewFilterLink={this.makeNewFilterLink}
              handleChangeRangeInput={this.setRangeInput}
              handleToggleExpandingFilter={this.handleToggleExpandingFilter}
              handleToggleFilterBox={this.handleToggleFilterBox}
              articleSearchState={articleSearchState}
            />
          </div>
          <Footer containerStyle={this.getContainerStyle()} />
        </div>
      );
    } else {
      // TODO: Make an error alerting page
      return null;
    }
  }

  private getSuggestionKeywordBox = () => {
    const { articleSearchState } = this.props;

    if (articleSearchState.highlightedSuggestionKeyword && articleSearchState.highlightedSuggestionKeyword.length > 0) {
      const targetSearchQueryParams = PapersQueryFormatter.stringifyPapersQuery({
        query: articleSearchState.suggestionKeyword,
        sort: "RELEVANCE",
        filter: {},
        page: 1,
      });

      return (
        <div className={styles.suggestionBox}>
          <span>{`Did you mean `}</span>
          <Link
            to={{
              pathname: "/search",
              search: targetSearchQueryParams,
            }}
            className={styles.suggestionLink}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: articleSearchState.highlightedSuggestionKeyword,
              }}
            />
          </Link>
          <span>{` ?`}</span>
        </div>
      );
    } else {
      return null;
    }
  };

  private getResultHelmet = (query: string) => {
    return (
      <Helmet>
        <title>{`${query} | Sci-napse | Academic search engine for paper`}</title>
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

  private makeNewFilterLink = (newFilter: FilterObject) => {
    const queryParamsObject = this.getUrlDecodedQueryParamsObject();

    return `/search?${PapersQueryFormatter.stringifyPapersQuery({
      query: queryParamsObject.query,
      page: 1,
      sort: queryParamsObject.sort,
      filter: { ...queryParamsObject.filter, ...newFilter },
    })}`;
  };

  private makePaginationLink = (page: number) => {
    const queryParamsObject = this.getUrlDecodedQueryParamsObject();
    const queryParams = PapersQueryFormatter.stringifyPapersQuery({
      ...queryParamsObject,
      page,
    });

    return `/search?${queryParams}`;
  };

  private setRangeInput = (params: Actions.ChangeRangeInputParams) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeRangeInput(params));
  };

  private handleToggleFilterBox = (type: Actions.FILTER_BOX_TYPE) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleFilterBox(type));
  };

  private handleToggleExpandingFilter = (type: Actions.FILTER_TYPE_HAS_EXPANDING_OPTION) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleExpandingFilter(type));
  };

  private renderLoadingSpinner = () => {
    return (
      <div className={styles.articleSearchContainer}>
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      </div>
    );
  };

  private getUrlDecodedQueryParamsObject(): SearchPageQueryParamsObject {
    const { location } = this.props;
    const rawQueryParamsObj: RawQueryParams = getQueryParamsObject(location.search);

    return {
      query: SafeURIStringHandler.decode(rawQueryParamsObj.query),
      page: parseInt(rawQueryParamsObj.page, 10),
      filter: PapersQueryFormatter.objectifyPapersFilter(rawQueryParamsObj.filter),
      sort: rawQueryParamsObj.sort,
    };
  }
}
export default withRouter(connect(mapStateToProps)(ArticleSearch));
