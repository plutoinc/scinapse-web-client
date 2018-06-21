import { parse } from "qs";
import * as React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { AppState } from "../../reducers";
import * as Actions from "./actions";
import SearchList from "./components/searchList";
import ArticleSpinner from "../common/spinner/articleSpinner";
import Pagination from "./components/pagination";
import SortBox from "./components/sortBox";
import FilterContainer from "./components/filterContainer";
import NoResult from "./components/noResult";
import { Paper } from "../../model/paper";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import papersQueryFormatter, {
  ParsedSearchPageQueryObject
} from "../../helpers/papersQueryFormatter";
import formatNumber from "../../helpers/formatNumber";
import { ArticleSearchContainerProps } from "./types";
import { Footer } from "../layouts";
import MobilePagination from "./components/mobile/pagination";
import { withStyles } from "../../helpers/withStylesHelper";
import { AvailableCitationType } from "../paperShow/records";
import CitationDialog from "../common/citationDialog";
import { postBookmark, removeBookmark } from "../../actions/bookmark";
import { getSearchData } from "./sideEffect";
import SafeURIStringHandler from "../../helpers/safeURIStringHandler";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";
const styles = require("./articleSearch.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
    currentUserState: state.currentUser,
    configuration: state.configuration
  };
}

@withStyles<typeof ArticleSearch>(styles)
class ArticleSearch extends React.PureComponent<
  ArticleSearchContainerProps,
  {}
> {
  private queryString = this.getCurrentSearchParamsString();
  private queryParamsObject = parse(this.queryString, {
    ignoreQueryPrefix: true
  });
  private parsedSearchQueryObject = this.getSearchQueryObject();

  public componentDidMount() {
    const { dispatch, match, configuration, location } = this.props;
    const notRenderedAtServerOrJSAlreadyInitialized =
      !configuration.initialFetched || configuration.clientJSRendered;

    this.setQueryParamsToState();

    if (notRenderedAtServerOrJSAlreadyInitialized) {
      getSearchData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: getQueryParamsObject(location.search)
      });
    }
  }

  public async componentDidUpdate(prevProps: ArticleSearchContainerProps) {
    const { dispatch, match, location } = this.props;
    const beforeSearch = prevProps.location.search;
    const afterSearch = this.props.location.search;

    if (!!afterSearch && beforeSearch !== afterSearch) {
      this.updateQueryParams();
      this.setQueryParamsToState();
      getSearchData({
        dispatch,
        match,
        pathname: location.pathname,
        queryParams: getQueryParamsObject(location.search)
      });
    }
  }

  public render() {
    const { articleSearchState, currentUserState } = this.props;
    const {
      isLoading,
      totalElements,
      totalPages,
      searchItemsToShow
    } = articleSearchState;
    const searchPage = parseInt(this.queryParamsObject.page, 10);
    const hasNoSearchResult =
      !articleSearchState.searchItemsToShow ||
      articleSearchState.searchItemsToShow.length === 0;

    if (isLoading) {
      return this.renderLoadingSpinner();
    } else if (hasNoSearchResult && this.parsedSearchQueryObject) {
      return (
        <NoResult
          searchText={this.parsedSearchQueryObject.query}
          articleSearchState={articleSearchState}
        />
      );
    } else if (
      this.parsedSearchQueryObject &&
      articleSearchState.aggregationData
    ) {
      const currentPageIndex: number = searchPage || 0;

      return (
        <div className={styles.articleSearchContainer}>
          {this.getResultHelmet(this.parsedSearchQueryObject.query)}
          <div className={styles.innerContainer}>
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>
                {formatNumber(totalElements)} results
              </span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>
                {currentPageIndex} of {formatNumber(totalPages)} pages
              </span>
              <SortBox
                query={this.parsedSearchQueryObject.query}
                sortOption={this.parsedSearchQueryObject.sort}
              />
            </div>
            {this.getSuggestionKeywordBox()}
            <SearchList
              checkVerifiedUser={this.checkVerifiedUser}
              currentUser={currentUserState}
              papers={searchItemsToShow}
              searchQueryText={this.parsedSearchQueryObject.query || ""}
              handlePostBookmark={this.handlePostBookmark}
              handleRemoveBookmark={this.handleRemoveBookmark}
              setActiveCitationDialog={this.setActiveCitationDialog}
              toggleCitationDialog={this.toggleCitationDialog}
            />
            {this.getPaginationComponent()}
            <Footer containerStyle={this.getContainerStyle()} />
          </div>
          <FilterContainer
            isFilterAvailable={articleSearchState.isFilterAvailable}
            handleToggleExpandingFilter={this.handleToggleExpandingFilter}
            isFOSFilterExpanding={articleSearchState.isFOSFilterExpanding}
            isJournalFilterExpanding={
              articleSearchState.isJournalFilterExpanding
            }
            aggregationData={articleSearchState.aggregationData}
            handleChangeRangeInput={this.handleChangeRangeInput}
            searchQueries={this.parsedSearchQueryObject}
            yearFrom={articleSearchState.yearFilterFromValue}
            yearTo={articleSearchState.yearFilterToValue}
            IFFrom={articleSearchState.IFFilterFromValue}
            IFTo={articleSearchState.IFFilterToValue}
            isYearFilterOpen={articleSearchState.isYearFilterOpen}
            isJournalIFFilterOpen={articleSearchState.isJournalIFFilterOpen}
            isFOSFilterOpen={articleSearchState.isFOSFilterOpen}
            isJournalFilterOpen={articleSearchState.isJournalFilterOpen}
            handleToggleFilterBox={this.handleToggleFilterBox}
          />
          {this.getCitationDialog()}
        </div>
      );
    } else {
      // TODO: Make an error alerting page
      return null;
    }
  }

  private getSuggestionKeywordBox = () => {
    const { articleSearchState } = this.props;

    if (
      articleSearchState.highlightedSuggestionKeyword &&
      articleSearchState.highlightedSuggestionKeyword.length > 0
    ) {
      const targetSearchQueryParams = papersQueryFormatter.stringifyPapersQuery(
        {
          query: articleSearchState.suggestionKeyword,
          sort: "RELEVANCE",
          filter: {},
          page: 1
        }
      );

      return (
        <div className={styles.suggestionBox}>
          <span>{`Did you mean `}</span>
          <Link
            to={{
              pathname: "/search",
              search: targetSearchQueryParams
            }}
            className={styles.suggestionLink}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: articleSearchState.highlightedSuggestionKeyword
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
        <title
        >{`${query} | Sci-napse | Academic search engine for paper`}</title>
      </Helmet>
    );
  };

  private getContainerStyle = (): React.CSSProperties => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return { position: "absolute", width: "100", bottom: "unset" };
    } else {
      return {};
    }
  };

  private checkVerifiedUser = (): boolean => {
    const { currentUserState, dispatch } = this.props;

    if (!currentUserState.isLoggedIn) {
      checkAuthDialog();
      return false;
    }

    const isVerifiedUser =
      currentUserState.oauthLoggedIn || currentUserState.emailVerified;

    if (!isVerifiedUser) {
      dispatch(openVerificationNeeded());
      return false;
    }

    return true;
  };

  private handleRemoveBookmark = (paper: Paper) => {
    const { dispatch, currentUserState } = this.props;

    if (!currentUserState.isLoggedIn) {
      return checkAuthDialog();
    }

    const hasRightToPostComment =
      currentUserState.oauthLoggedIn || currentUserState.emailVerified;

    if (!hasRightToPostComment) {
      return dispatch(openVerificationNeeded());
    }

    if (currentUserState.isLoggedIn) {
      dispatch(removeBookmark(paper));
    }
  };

  private setQueryParamsToState = () => {
    this.changeSearchInput(
      this.parsedSearchQueryObject
        ? this.parsedSearchQueryObject.query || ""
        : ""
    );
    this.handleChangeRangeInput({
      rangeType: Actions.FILTER_RANGE_TYPE.FROM,
      numberValue: this.parsedSearchQueryObject.filter.yearFrom,
      type: Actions.FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR
    });
    this.handleChangeRangeInput({
      rangeType: Actions.FILTER_RANGE_TYPE.TO,
      numberValue: this.parsedSearchQueryObject.filter.yearTo,
      type: Actions.FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR
    });
    this.handleChangeRangeInput({
      rangeType: Actions.FILTER_RANGE_TYPE.FROM,
      numberValue: this.parsedSearchQueryObject.filter.journalIFFrom,
      type: Actions.FILTER_TYPE_HAS_RANGE.JOURNAL_IF
    });
    this.handleChangeRangeInput({
      rangeType: Actions.FILTER_RANGE_TYPE.TO,
      numberValue: this.parsedSearchQueryObject.filter.journalIFTo,
      type: Actions.FILTER_TYPE_HAS_RANGE.JOURNAL_IF
    });
  };

  private getPaginationComponent = () => {
    const { articleSearchState, layout } = this.props;
    const { totalPages } = articleSearchState;

    const searchPage = parseInt(this.queryParamsObject.page, 10) - 1;
    const currentPageIndex: number = searchPage || 0;

    if (layout.isMobile) {
      return (
        <MobilePagination
          totalPageCount={totalPages}
          currentPageIndex={currentPageIndex}
          searchQueryObj={this.parsedSearchQueryObject}
        />
      );
    } else {
      return (
        <Pagination
          totalPageCount={totalPages}
          currentPageIndex={currentPageIndex}
          searchQueryObj={this.parsedSearchQueryObject}
        />
      );
    }
  };

  private handleChangeRangeInput = (params: Actions.ChangeRangeInputParams) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeRangeInput(params));
  };

  private handleToggleFilterBox = (type: Actions.FILTER_BOX_TYPE) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleFilterBox(type));
  };

  private handleToggleExpandingFilter = (
    type: Actions.FILTER_TYPE_HAS_EXPANDING_OPTION
  ) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleExpandingFilter(type));
  };

  private handleClickCitationTab = (
    tab: AvailableCitationType,
    paperId: number
  ) => {
    const { dispatch } = this.props;

    dispatch(Actions.handleClickCitationTab(tab));
    dispatch(Actions.getCitationText({ type: tab, paperId }));
  };

  private toggleCitationDialog = () => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleCitationDialog());
  };

  private getCitationDialog = () => {
    const { articleSearchState } = this.props;

    if (articleSearchState.activeCitationDialogPaperId) {
      return (
        <CitationDialog
          paperId={articleSearchState.activeCitationDialogPaperId}
          isOpen={articleSearchState.isCitationDialogOpen}
          toggleCitationDialog={this.toggleCitationDialog}
          handleClickCitationTab={this.handleClickCitationTab}
          activeTab={articleSearchState.activeCitationTab}
          isLoading={articleSearchState.isFetchingCitationInformation}
          citationText={articleSearchState.citationText}
        />
      );
    }
  };

  private handlePostBookmark = async (paper: Paper) => {
    const { dispatch, currentUserState } = this.props;

    if (!currentUserState.isLoggedIn) {
      checkAuthDialog();
      throw new Error();
    }

    const hasRightToPostComment =
      currentUserState.oauthLoggedIn || currentUserState.emailVerified;

    if (!hasRightToPostComment) {
      dispatch(openVerificationNeeded());
      throw new Error();
    }

    if (currentUserState.isLoggedIn) {
      try {
        await dispatch(postBookmark(paper));
      } catch (err) {
        throw err;
      }
    }
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

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private setActiveCitationDialog = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.setActiveCitationDialogPaperId(paperId));
  };

  private getCurrentSearchParamsString() {
    const { location } = this.props;
    return decodeURIComponent(location.search);
  }

  private getSearchQueryObject(): ParsedSearchPageQueryObject {
    return {
      ...this.queryParamsObject,
      ...{
        query: SafeURIStringHandler.decode(this.queryParamsObject.query),
        filter: papersQueryFormatter.objectifyPapersFilter(
          this.queryParamsObject.filter || ""
        )
      }
    };
  }

  private updateQueryParams(): void {
    this.queryString = this.getCurrentSearchParamsString();
    this.queryParamsObject = getQueryParamsObject(this.queryString);
    this.parsedSearchQueryObject = this.getSearchQueryObject();
  }
}
export default withRouter(connect(mapStateToProps)(ArticleSearch));
