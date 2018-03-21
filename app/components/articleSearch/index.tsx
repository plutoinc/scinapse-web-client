import { parse } from "qs";
import * as _ from "lodash";
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
import { PaperList } from "../../model/paper";
import { trackModalView } from "../../helpers/handleGA";
import AxiosCancelTokenManager from "../../helpers/axiosCancelTokenManager";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import papersQueryFormatter, { SearchQueryObj } from "../../helpers/papersQueryFormatter";
import numberWithCommas from "../../helpers/numberWithCommas";
import { FetchSearchItemsParams } from "./types/actions";
import { SEARCH_FETCH_ITEM_MODE, IArticleSearchContainerProps, IArticleSearchSearchParams } from "./types";
import { GetCommentsComponentParams, PostCommentsComponentParams } from "../../api/types/comment";
import { Footer } from "../layouts";
import MobilePagination from "./components/mobile/pagination";
import { withStyles } from "../../helpers/withStylesHelper";
import EnvChecker from "../../helpers/envChecker";
import { LoadDataParams } from "../../routes";
const styles = require("./articleSearch.scss");

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
    routing: state.routing,
    currentUserState: state.currentUser,
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

function makeSearchQueryFromParamsObject(searchParams: IArticleSearchSearchParams) {
  const query = getOriginalQuery(searchParams.query);
  const searchPage = parseInt(searchParams.page, 10) - 1 || 0;
  const filter = searchParams.filter;
  const references = searchParams.references;
  const cited = searchParams.cited;
  const cognitiveId = searchParams.cognitiveId ? parseInt(searchParams.cognitiveId, 10) : null;
  const searchQueryOnly = query && !references && !cited;
  const searchWithRef = !!references;
  const searchWithCite = !!cited;

  if (searchQueryOnly) {
    return {
      query,
      filter,
      page: searchPage,
      mode: SEARCH_FETCH_ITEM_MODE.QUERY,
    };
  } else if (searchWithRef) {
    return {
      paperId: parseInt(references, 10),
      filter,
      page: searchPage,
      mode: SEARCH_FETCH_ITEM_MODE.REFERENCES,
      cognitiveId,
    };
  } else if (searchWithCite) {
    return {
      paperId: parseInt(cited, 10),
      filter,
      page: searchPage,
      mode: SEARCH_FETCH_ITEM_MODE.CITED,
      cognitiveId,
    };
  } else {
    return null;
  }
}

@withStyles<typeof ArticleSearch>(styles)
class ArticleSearch extends React.PureComponent<IArticleSearchContainerProps, {}> {
  private cancelTokenSource: CancelTokenSource = this.getAxiosCancelToken();
  private queryString = this.getCurrentSearchParamsString();
  private queryParamsObject = parse(this.queryString, { ignoreQueryPrefix: true });
  private articleSearchParams = makeSearchQueryFromParamsObject(this.queryParamsObject);
  private parsedSearchQueryObject = this.getSearchQueryObject(this.queryParamsObject);

  public componentDidMount() {
    this.setQueryParamsToState();
    this.fetchSearchItems(this.articleSearchParams);
  }

  public componentDidUpdate(prevProps: IArticleSearchContainerProps) {
    const beforeSearch = prevProps.routing.location.search;
    const afterSearch = this.props.routing.location.search;

    if (!!afterSearch && beforeSearch !== afterSearch) {
      this.restoreBrowserScrollToTop();
      this.updateQueryParams();
      this.setQueryParamsToState();
      this.fetchSearchItems(this.articleSearchParams);
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
        <title>{`${query} | sci-napse | Academic search engine for paper`}</title>
      </Helmet>
    );
  };

  private getContainerStyle: () => React.CSSProperties = () => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return { position: "absolute", width: "100", bottom: "unset" };
    }
  };

  private setQueryParamsToState = () => {
    this.changeSearchInput(this.parsedSearchQueryObject ? this.parsedSearchQueryObject.query || "" : "");
    this.handleYearFilterInputChange(Actions.PUBLISH_YEAR_FILTER_TYPE.FROM, this.parsedSearchQueryObject.yearFrom);
    this.handleYearFilterInputChange(Actions.PUBLISH_YEAR_FILTER_TYPE.TO, this.parsedSearchQueryObject.yearTo);
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

  private handleYearFilterInputChange = (type: Actions.PUBLISH_YEAR_FILTER_TYPE, year: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.changePublishYearInput(type, year));
  };

  private getFilterComponent = () => {
    const { articleSearchState } = this.props;

    return (
      <FilterContainer
        handleYearFilterInputChange={this.handleYearFilterInputChange}
        searchQueries={this.parsedSearchQueryObject}
        yearFrom={articleSearchState.yearFilterFromValue}
        yearTo={articleSearchState.yearFilterToValue}
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

  private fetchSearchItems = async (params: FetchSearchItemsParams | null) => {
    const { dispatch, articleSearchState } = this.props;

    if (!!params && !articleSearchState.isLoading) {
      await dispatch(Actions.fetchSearchItems(params, this.cancelTokenSource));
    }
  };

  private mapPaperNode = (papers: PaperList, searchItemsMeta: SearchItemMetaList, searchQueryText: string) => {
    const { currentUserState } = this.props;

    const searchItems = papers.map((paper, index) => {
      return (
        <SearchItem
          key={`paper_${paper.id || paper.cognitivePaperId}`}
          paper={paper}
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

  private getSearchQueryObject(searchParams: IArticleSearchSearchParams): SearchQueryObj {
    if (searchParams.filter) {
      let decodedQueryText: string;
      try {
        decodedQueryText = decodeURIComponent(searchParams.query || "");
      } catch (_err) {
        decodedQueryText = searchParams.query;
      }

      const exceptFilterSearchParams: object = _.omit(searchParams, ["filter"]);

      return {
        ...exceptFilterSearchParams,
        ...{ query: decodedQueryText },
        ...papersQueryFormatter.objectifyPapersFilter(searchParams.filter),
      };
    }
  }

  private updateQueryParams(): void {
    this.queryString = this.getCurrentSearchParamsString();
    this.queryParamsObject = parse(this.queryString, { ignoreQueryPrefix: true });
    this.articleSearchParams = makeSearchQueryFromParamsObject(this.queryParamsObject);
    this.parsedSearchQueryObject = this.getSearchQueryObject(this.queryParamsObject);
  }
}
export default connect(mapStateToProps)(ArticleSearch);
