import { parse } from "qs";
import * as React from "react";
import { CancelTokenSource } from "axios";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { SearchItemMetaList } from "./records";
import Icon from "../../icons";
import { AppState } from "../../reducers";
import * as Actions from "./actions";
import SearchItem from "./components/searchItem";
import ArticleSpinner from "../common/spinner/articleSpinner";
import Pagination from "./components/pagination";
import FilterContainer from "./components/filterContainer";
import NoResult, { NoResultType } from "./components/noResult";
import { PaperList, PaperRecord } from "../../model/paper";
import { trackModalView } from "../../helpers/handleGA";
import AxiosCancelTokenManager from "../../helpers/axiosCancelTokenManager";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import papersQueryFormatter, { ParsedSearchPageQueryParams } from "../../helpers/papersQueryFormatter";
import numberWithCommas from "../../helpers/numberWithCommas";
import { ArticleSearchContainerProps, ArticleSearchSearchParams } from "./types";
import { GetCommentsComponentParams, PostCommentsComponentParams } from "../../api/types/comment";
import { Footer } from "../layouts";
import MobilePagination from "./components/mobile/pagination";
import { withStyles } from "../../helpers/withStylesHelper";
import EnvChecker from "../../helpers/envChecker";
import { LoadDataParams } from "../../routes";
import { withRouter } from "react-router-dom";
import { AvailableCitationType } from "../paperShow/records";
import CitationDialog from "../common/citationDialog";
import { postBookmark, removeBookmark, getBookmarkedStatus } from "../../actions/bookmark";
import { GetPapersParams } from "../../api/types/paper";
const styles = require("./articleSearch.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
    routing: state.routing,
    currentUserState: state.currentUser,
    configuration: state.configuration,
  };
}

export async function getSearchData({ dispatch, queryParams }: LoadDataParams) {
  const searchQueryObject = makeSearchQueryFromParamsObject(queryParams);
  await dispatch(Actions.fetchSearchItems(searchQueryObject));
}

function getOriginalQuery(query: string) {
  try {
    return decodeURIComponent(query);
  } catch (_err) {
    return query;
  }
}

export async function getAggregationData({ dispatch, queryParams }: LoadDataParams) {
  await dispatch(
    Actions.getAggregationData({
      query: getOriginalQuery(queryParams.query) || "",
      filter: queryParams.filter,
    }),
  );
}

function makeSearchQueryFromParamsObject(queryParams: ArticleSearchSearchParams) {
  const query = getOriginalQuery(queryParams.query);
  const searchPage = parseInt(queryParams.page, 10) - 1 || 0;
  const filter = queryParams.filter;

  return {
    query,
    filter,
    page: searchPage,
  };
}

@withStyles<typeof ArticleSearch>(styles)
class ArticleSearch extends React.PureComponent<ArticleSearchContainerProps, {}> {
  private cancelTokenSource: CancelTokenSource = this.getAxiosCancelToken();
  private queryString = this.getCurrentSearchParamsString();
  private queryParamsObject = parse(this.queryString, { ignoreQueryPrefix: true });
  private articleSearchParams = makeSearchQueryFromParamsObject(this.queryParamsObject);
  private parsedSearchQueryObject = this.getSearchQueryObject();

  public componentDidMount() {
    const { dispatch, match, configuration } = this.props;

    this.setQueryParamsToState();

    if (!configuration.initialFetched || configuration.clientJSRendered) {
      this.fetchSearchItems(this.articleSearchParams);
      getAggregationData({ dispatch, match, queryParams: this.queryParamsObject });
    }
  }

  public componentDidUpdate(prevProps: ArticleSearchContainerProps) {
    const { configuration, dispatch, match } = this.props;
    const beforeSearch = prevProps.routing.location.search;
    const afterSearch = this.props.routing.location.search;

    if (!!afterSearch && beforeSearch !== afterSearch) {
      this.restoreBrowserScrollToTop();
      this.updateQueryParams();
      this.setQueryParamsToState();

      if (!configuration.initialFetched || configuration.clientJSRendered) {
        this.fetchSearchItems(this.articleSearchParams);
        getAggregationData({ dispatch, match, queryParams: this.queryParamsObject });
      }
    }
  }

  public render() {
    const { articleSearchState } = this.props;
    const { isLoading, totalElements, totalPages, searchItemsToShow, searchItemsMeta } = articleSearchState;
    const searchPage = parseInt(this.queryParamsObject.page, 10) - 1;

    const hasNoSearchResult = articleSearchState.searchItemsToShow.isEmpty();

    if (isLoading) {
      return this.renderLoadingSpinner();
    } else if (hasNoSearchResult && this.parsedSearchQueryObject) {
      return (
        <NoResult
          type={this.getNoResultType()}
          searchText={this.parsedSearchQueryObject.query}
          articleSearchState={articleSearchState}
        />
      );
    } else if (this.parsedSearchQueryObject) {
      const currentPageIndex: number = searchPage || 0;

      return (
        <div className={styles.articleSearchContainer}>
          {this.getResultHelmet(this.parsedSearchQueryObject.query)}
          <div className={styles.innerContainer}>
            {this.getInflowRoute()}
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>{numberWithCommas(totalElements)} results</span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>
                {currentPageIndex + 1} of {numberWithCommas(totalPages)} pages
              </span>
            </div>
            {this.mapPaperNode(searchItemsToShow, searchItemsMeta, this.parsedSearchQueryObject.query)}
            {this.getPaginationComponent()}
            <Footer containerStyle={this.getContainerStyle()} />
          </div>
          {this.getFilterComponent()}
          {this.getCitationDialog()}
        </div>
      );
    } else {
      // TODO: Make an error alerting page
      return null;
    }
  }

  private getResultHelmet = (query: string) => {
    return (
      <Helmet>
        <title>{`${query} | Sci-napse | Academic search engine for paper`}</title>
      </Helmet>
    );
  };

  private getContainerStyle: () => React.CSSProperties = () => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return { position: "absolute", width: "100", bottom: "unset" };
    }
  };

  private handlePostBookmark = (paper: PaperRecord) => {
    const { dispatch, currentUserState } = this.props;

    checkAuthDialog();

    if (currentUserState.isLoggedIn) {
      dispatch(postBookmark(paper));
    }
  };

  private handleRemoveBookmark = (paper: PaperRecord) => {
    const { dispatch, currentUserState } = this.props;

    checkAuthDialog();

    if (currentUserState.isLoggedIn) {
      dispatch(removeBookmark(paper));
    }
  };

  private setQueryParamsToState = () => {
    this.changeSearchInput(this.parsedSearchQueryObject ? this.parsedSearchQueryObject.query || "" : "");
    this.handleChangeRangeInput({
      rangeType: Actions.FILTER_RANGE_TYPE.FROM,
      numberValue: this.parsedSearchQueryObject.filter.yearFrom,
      type: Actions.FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
    });
    this.handleChangeRangeInput({
      rangeType: Actions.FILTER_RANGE_TYPE.TO,
      numberValue: this.parsedSearchQueryObject.filter.yearTo,
      type: Actions.FILTER_TYPE_HAS_RANGE.PUBLISHED_YEAR,
    });
    this.handleChangeRangeInput({
      rangeType: Actions.FILTER_RANGE_TYPE.FROM,
      numberValue: this.parsedSearchQueryObject.filter.journalIFFrom,
      type: Actions.FILTER_TYPE_HAS_RANGE.JOURNAL_IF,
    });
    this.handleChangeRangeInput({
      rangeType: Actions.FILTER_RANGE_TYPE.TO,
      numberValue: this.parsedSearchQueryObject.filter.journalIFTo,
      type: Actions.FILTER_TYPE_HAS_RANGE.JOURNAL_IF,
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

  private handleToggleExpandingFilter = (type: Actions.FILTER_TYPE_HAS_EXPANDING_OPTION) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleExpandingFilter(type));
  };

  private handleClickCitationTab = (tab: AvailableCitationType, paperId: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.handleClickCitationTab(tab));
    dispatch(Actions.getCitationText({ type: tab, paperId }));
  };

  private getFilterComponent = () => {
    const { articleSearchState } = this.props;

    return (
      <FilterContainer
        isFilterAvailable={articleSearchState.isFilterAvailable}
        handleToggleExpandingFilter={this.handleToggleExpandingFilter}
        isFOSFilterExpanding={articleSearchState.isFOSFilterExpanding}
        isJournalFilterExpanding={articleSearchState.isJournalFilterExpanding}
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
    );
  };

  private toggleCitationDialog = () => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleCitationDialog());
  };

  private getCitationDialog = () => {
    const { articleSearchState } = this.props;

    return (
      <CitationDialog
        paperId={articleSearchState.activeCitationDialogPaperId}
        isOpen={articleSearchState.isCitationDialogOpen}
        toggleCitationDialog={this.toggleCitationDialog}
        handleClickCitationTab={this.handleClickCitationTab}
        activeTab={articleSearchState.activeCitationTab}
        isLoading={articleSearchState.isFetchingCitationInformation}
        citationText={articleSearchState.citationText}
        isFullFeature={true}
      />
    );
  };

  private getNoResultType = () => {
    const searchReferences = this.queryParamsObject.references;
    const searchCited = this.queryParamsObject.cited;
    const searchQuery = this.queryParamsObject.query;

    const hasSearchQueryOnly = searchQuery && !searchReferences && !searchCited;
    const hasSearchQueryWithRef = !!searchReferences;
    const hasSearchQueryWithCite = !!searchCited;

    if (hasSearchQueryOnly) {
      return NoResultType.FROM_SEARCH_QUERY;
    } else if (hasSearchQueryWithRef) {
      return NoResultType.FROM_REF;
    } else if (hasSearchQueryWithCite) {
      return NoResultType.FROM_CITE;
    }
  };

  private getAxiosCancelToken() {
    const axiosCancelTokenManager = new AxiosCancelTokenManager();
    return axiosCancelTokenManager.getCancelTokenSource();
  }

  private renderLoadingSpinner = () => {
    return (
      <div className={styles.articleSearchContainer}>
        <div className={styles.loadingContainer}>
          <ArticleSpinner className={styles.loadingSpinner} />
        </div>
      </div>
    );
  };

  private restoreBrowserScrollToTop = () => {
    if (!EnvChecker.isServer()) {
      window.scrollTo(0, 0);
    }
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private fetchSearchItems = async (params: GetPapersParams | null) => {
    const { dispatch, currentUserState, articleSearchState } = this.props;

    if (!!params && !articleSearchState.isLoading) {
      const paperList = await dispatch(Actions.fetchSearchItems(params));

      if (currentUserState.isLoggedIn) {
        await dispatch(getBookmarkedStatus(paperList));
      }
    }
  };

  private setActiveCitationDialog = (paperId: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.setActiveCitationDialogPaperId(paperId));
  };

  private mapPaperNode = (papers: PaperList, searchItemsMeta: SearchItemMetaList, searchQueryText: string) => {
    const { currentUserState } = this.props;

    const searchItems = papers.map((paper, index) => {
      return (
        <SearchItem
          key={`paper_${paper.id || paper.cognitivePaperId}`}
          paper={paper}
          setActiveCitationDialog={this.setActiveCitationDialog}
          toggleCitationDialog={this.toggleCitationDialog}
          commentInput={searchItemsMeta.getIn([index, "commentInput"])}
          changeCommentInput={(comment: string) => {
            this.changeCommentInput(index, comment);
          }}
          isAbstractOpen={searchItemsMeta.getIn([index, "isAbstractOpen"])}
          toggleAbstract={() => {
            this.toggleAbstract(index);
          }}
          isCommentsOpen={searchItemsMeta.getIn([index, "isCommentsOpen"])}
          toggleComments={() => {
            this.toggleComments(index);
          }}
          isAuthorsOpen={searchItemsMeta.getIn([index, "isAuthorsOpen"])}
          toggleAuthors={() => {
            this.toggleAuthors(index);
          }}
          isTitleVisited={searchItemsMeta.getIn([index, "isTitleVisited"])}
          visitTitle={() => {
            this.visitTitle(index);
          }}
          isBookmarked={searchItemsMeta.getIn([index, "isBookmarked"])}
          handlePostBookmark={this.handlePostBookmark}
          handleRemoveBookmark={this.handleRemoveBookmark}
          handlePostComment={() => {
            this.handlePostComment({
              index,
              paperId: paper.id,
              cognitivePaperId: paper.cognitivePaperId,
            });
          }}
          withComments={true}
          isLoading={searchItemsMeta.getIn([index, "isLoading"])}
          searchQueryText={searchQueryText}
          isFirstOpen={searchItemsMeta.getIn([index, "isFirstOpen"])}
          closeFirstOpen={() => {
            this.closeFirstOpen(index);
          }}
          currentUser={currentUserState}
          deleteComment={(commentId: number) => {
            this.deleteComment(paper.id, commentId);
          }}
          getMoreComments={() => {
            this.getMoreComments({
              cognitiveId: paper.cognitivePaperId,
              paperId: paper.id,
              page: searchItemsMeta.getIn([index, "page"]),
            });
          }}
          isPageLoading={searchItemsMeta.getIn([index, "isPageLoading"])}
        />
      );
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  };

  private changeCommentInput = (index: number, comment: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeCommentInput(index, comment));
  };

  private toggleAbstract = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleAbstract(index));
  };

  private toggleComments = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleComments(index));
  };

  private toggleAuthors = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleAuthors(index));
  };

  private visitTitle = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.visitTitle(index));
  };

  private handlePostComment = ({ index, paperId, cognitivePaperId }: PostCommentsComponentParams) => {
    const { dispatch, articleSearchState, currentUserState } = this.props;
    const trimmedComment = articleSearchState.searchItemsMeta.getIn([index, "commentInput"]).trim();

    checkAuthDialog();

    if (currentUserState.isLoggedIn) {
      const hasRightToPostComment = currentUserState.oauthLoggedIn || currentUserState.emailVerified;
      if (!hasRightToPostComment) {
        dispatch(openVerificationNeeded());
        trackModalView("postCommentVerificationNeededOpen");
      } else if (trimmedComment.length > 0) {
        dispatch(Actions.postComment({ paperId, cognitivePaperId, comment: trimmedComment }));
      }
    }
  };

  private closeFirstOpen = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.closeFirstOpen(index));
  };

  private deleteComment = (paperId: number, commentId: number) => {
    const { dispatch } = this.props;

    dispatch(
      Actions.deleteComment({
        paperId,
        commentId,
      }),
    );
  };

  private getMoreComments = ({ paperId, page, cognitiveId }: GetCommentsComponentParams) => {
    const { dispatch } = this.props;

    dispatch(
      Actions.getMoreComments({
        paperId,
        cognitiveId,
        page,
        cancelTokenSource: this.cancelTokenSource,
      }),
    );
  };

  private getInflowRoute = () => {
    const { articleSearchState } = this.props;
    const { targetPaper, totalElements } = articleSearchState;

    const searchReferences = this.parsedSearchQueryObject.references;
    const searchCited = this.parsedSearchQueryObject.cited;
    const isCognitiveSearch = !!this.parsedSearchQueryObject.cognitiveId;

    if (!targetPaper || (!isCognitiveSearch && !searchReferences && !searchCited)) {
      return;
    }

    let inflowQueryResult;
    if (searchReferences || (isCognitiveSearch && (searchReferences || searchReferences === 0))) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
          {numberWithCommas(totalElements)} References of
        </div>
      );
    } else if (searchCited || (isCognitiveSearch && (searchCited || searchCited === 0))) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.citedIconWrapper} icon="CITED" />
          {numberWithCommas(totalElements)} Papers Citing
        </div>
      );
    } else {
      return null;
    }

    return (
      <div className={styles.inflowRouteContainer}>
        {inflowQueryResult}
        <div className={styles.inflowArticleInfo}>{targetPaper.title}</div>
        <div className={styles.separatorLine} />
      </div>
    );
  };

  private getCurrentSearchParamsString() {
    const { routing } = this.props;
    return decodeURIComponent(routing.location.search);
  }

  private getSearchQueryObject(): ParsedSearchPageQueryParams {
    let decodedQueryText: string;
    try {
      decodedQueryText = decodeURIComponent(this.queryParamsObject.query || "");
    } catch (_err) {
      decodedQueryText = this.queryParamsObject.query;
    }

    return {
      ...this.queryParamsObject,
      ...{
        query: decodedQueryText,
        filter: papersQueryFormatter.objectifyPapersFilter(this.queryParamsObject.filter || ""),
      },
    };
  }

  private updateQueryParams(): void {
    this.queryString = this.getCurrentSearchParamsString();
    this.queryParamsObject = parse(this.queryString, { ignoreQueryPrefix: true });
    this.articleSearchParams = makeSearchQueryFromParamsObject(this.queryParamsObject);
    this.parsedSearchQueryObject = this.getSearchQueryObject();
  }
}
export default connect(mapStateToProps)(withRouter(ArticleSearch));
