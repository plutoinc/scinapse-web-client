import { parse } from "qs";
import * as React from "react";
import { CancelTokenSource } from "axios";
import { connect } from "react-redux";
import { ISearchItemsMeta } from "./records";
import Icon from "../../icons";
import { IAppState } from "../../reducers";
import * as Actions from "./actions";
import SearchItem from "./components/searchItem";
import ArticleSpinner from "../common/spinner/articleSpinner";
import Pagination from "./components/pagination";
import FilterContainer from "./components/filterContainer";
import NoResult, { NoResultType } from "./components/noResult";
import { IPapersRecord } from "../../model/paper";
import { trackModalView } from "../../helpers/handleGA";
import AxiosCancelTokenManager from "../../helpers/axiosCancelTokenManager";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { openVerificationNeeded } from "../dialog/actions";
import papersQueryFormatter, { IFormatPapersQueryParams } from "../../helpers/papersQueryFormatter";
import numberWithCommas from "../../helpers/numberWithCommas";
import { FetchSearchItemsParams } from "./types/actions";
import { fetchSearchItems } from "./actions";
import {
  SEARCH_FETCH_ITEM_MODE,
  IArticleSearchContainerProps,
  SEARCH_FILTER_MODE,
  IArticleSearchSearchParams,
} from "./types";
const styles = require("./articleSearch.scss");

function mapStateToProps(state: IAppState) {
  return {
    articleSearchState: state.articleSearch,
    routing: state.routing,
    currentUserState: state.currentUser,
  };
}

class ArticleSearch extends React.Component<IArticleSearchContainerProps, {}> {
  private cancelTokenSource: CancelTokenSource = this.getAxiosCancelToken();

  public componentDidMount() {
    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    const searchQueryObject = this.makeSearchQueryFromParamsObject(searchParams);

    this.setOrClearSearchInput(searchParams);
    this.fetchSearchItems(searchQueryObject);
  }

  public componentDidUpdate(prevProps: IArticleSearchContainerProps) {
    const afterSearch = this.props.routing.location.search;
    const beforeSearch = prevProps.routing.location.search;

    if (afterSearch && beforeSearch !== afterSearch) {
      const searchParams: IArticleSearchSearchParams = this.getParsedSearchParamsObject(afterSearch);
      const searchQueryObject = this.makeSearchQueryFromParamsObject(searchParams);

      this.restoreBrowserScrollToTop();
      this.setOrClearSearchInput(searchParams);
      this.fetchSearchItems(searchQueryObject);
    }
  }

  public render() {
    const { articleSearchState } = this.props;
    const { isLoading, totalElements, totalPages, searchItemsToShow, searchItemsMeta } = articleSearchState;
    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    const searchPage = parseInt(searchParams.page, 10) - 1;
    const searchQuery = searchParams.query;

    let searchQueryObj;
    if (searchQuery) {
      searchQueryObj = this.getSearchQueryObject(searchParams);
    }

    const hasNoSearchResult = articleSearchState.searchItemsToShow.isEmpty();

    if (isLoading) {
      return this.renderLoadingSpinner();
    } else if (hasNoSearchResult && searchQueryObj) {
      return (
        <NoResult
          type={this.getNoResultType()}
          searchText={searchQueryObj.text}
          articleSearchState={articleSearchState}
        />
      );
    } else {
      const currentPageIndex: number = searchPage || 0;

      return (
        <div className={styles.articleSearchContainer}>
          {this.getFilterComponent(searchQueryObj)}
          <div className={styles.innerContainer}>
            {this.getInflowRoute()}
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>{numberWithCommas(totalElements)} results</span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>
                {currentPageIndex + 1} of {numberWithCommas(totalPages)} pages
              </span>
            </div>
            {this.mapPaperNode(searchItemsToShow, searchItemsMeta, searchQueryObj ? searchQueryObj.text : "")}
            <Pagination totalPageCount={totalPages} currentPageIndex={currentPageIndex} searchQuery={searchQuery} />
          </div>
        </div>
      );
    }
  }

  private getFilterComponent = (searchQueryObj: IFormatPapersQueryParams | undefined) => {
    return (
      <FilterContainer
        getPathAddedFilter={this.getPathAddedFilter}
        publicationYearFilterValue={searchQueryObj ? searchQueryObj.yearFrom : null}
        journalIFFilterValue={searchQueryObj ? searchQueryObj.journalIFFrom : null}
      />
    );
  };

  private getNoResultType = () => {
    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;
    const searchQuery = searchParams.query;

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
          <div className={styles.loadingContent}>Loading paper information</div>
        </div>
      </div>
    );
  };

  private getCurrentSearchParamsString = () => {
    const { routing } = this.props;
    return routing.location.search;
  };

  private getParsedSearchParamsObject = (searchString: string): IArticleSearchSearchParams => {
    return parse(searchString, { ignoreQueryPrefix: true });
  };

  private makeSearchQueryFromParamsObject = (searchParams: IArticleSearchSearchParams) => {
    const searchPage = parseInt(searchParams.page, 10) - 1 || 0;

    const searchQuery = searchParams.query;
    const references = searchParams.references;
    const cited = searchParams.cited;
    const cognitiveId = searchParams.cognitiveId ? parseInt(searchParams.cognitiveId, 10) : null;

    const searchQueryOnly = searchQuery && !references && !cited;
    const searchWithRef = !!references;
    const searchWithCite = !!cited;

    if (searchQueryOnly) {
      return {
        query: searchQuery,
        page: searchPage,
        mode: SEARCH_FETCH_ITEM_MODE.QUERY,
      };
    } else if (searchWithRef) {
      return {
        paperId: parseInt(references, 10),
        page: searchPage,
        mode: SEARCH_FETCH_ITEM_MODE.REFERENCES,
        cognitiveId,
      };
    } else if (searchWithCite) {
      return {
        paperId: parseInt(cited, 10),
        page: searchPage,
        mode: SEARCH_FETCH_ITEM_MODE.CITED,
        cognitiveId,
      };
    } else {
      return null;
    }
  };

  private restoreBrowserScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  private setOrClearSearchInput = (searchParams: IArticleSearchSearchParams) => {
    if (searchParams.query) {
      const searchQueryObj = this.getSearchQueryObject(searchParams);
      this.changeSearchInput(searchQueryObj.text || "");
    } else {
      this.changeSearchInput("");
    }
  };

  private getSearchQueryObject = (searchParams: IArticleSearchSearchParams) => {
    if (searchParams.query) {
      const query = decodeURIComponent(searchParams.query);
      return papersQueryFormatter.objectifyPapersQuery(query);
    }
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private fetchSearchItems = async (params: FetchSearchItemsParams | null) => {
    const { dispatch, articleSearchState } = this.props;

    if (!!params && !articleSearchState.isLoading) {
      dispatch(fetchSearchItems(params, this.cancelTokenSource));
    }
  };

  private getPathAddedFilter = (mode: SEARCH_FILTER_MODE, value: number): string => {
    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    let text, yearFrom, yearTo, journalIFFrom, journalIFTo;
    if (!!searchParams.query) {
      const searchQueryObj = papersQueryFormatter.objectifyPapersQuery(searchParams.query);
      text = searchQueryObj.text;
      yearFrom = searchQueryObj.yearFrom;
      yearTo = searchQueryObj.yearTo;
      journalIFFrom = searchQueryObj.journalIFFrom;
      journalIFTo = searchQueryObj.journalIFTo;
    }

    switch (mode) {
      case SEARCH_FILTER_MODE.PUBLICATION_YEAR:
        yearFrom = new Date().getFullYear() - value;
        break;
      case SEARCH_FILTER_MODE.JOURNAL_IF:
        journalIFFrom = value;
        break;
      default:
        break;
    }

    return `/search?query=${papersQueryFormatter.formatPapersQuery({
      text,
      yearFrom,
      yearTo,
      journalIFFrom,
      journalIFTo,
    })}&page=1`;
  };

  private mapPaperNode = (papers: IPapersRecord, searchItemsMeta: ISearchItemsMeta, searchQueryText: string) => {
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
            this.handlePostComment(index, paper.id);
          }}
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
            this.getMoreComments(paper.id, searchItemsMeta.getIn([index, "page"]));
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

  private handlePostComment = (index: number, paperId: number) => {
    const { dispatch, articleSearchState, currentUserState } = this.props;
    const trimmedComment = articleSearchState.searchItemsMeta.getIn([index, "commentInput"]).trim();

    checkAuthDialog();
    if (currentUserState.isLoggedIn) {
      const hasRightToPostComment = currentUserState.oauthLoggedIn || currentUserState.emailVerified;
      if (!hasRightToPostComment) {
        dispatch(openVerificationNeeded());
        trackModalView("postCommentVerificationNeededOpen");
      } else if (trimmedComment.length > 0) {
        dispatch(Actions.postComment({ paperId, comment: trimmedComment }));
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

  private getMoreComments = (paperId: number, currentPage: number) => {
    const { dispatch } = this.props;

    dispatch(
      Actions.getMoreComments({
        paperId,
        page: currentPage,
        cancelTokenSource: this.cancelTokenSource,
      }),
    );
  };

  private getInflowRoute = () => {
    const { articleSearchState } = this.props;
    const { targetPaper, totalElements } = articleSearchState;

    const searchString = this.getCurrentSearchParamsString();
    const searchParams = this.getParsedSearchParamsObject(searchString);
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;

    if (!targetPaper || (!searchReferences && !searchCited)) {
      return;
    }

    let inflowQueryResult;

    if (!!searchReferences) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
          {numberWithCommas(totalElements)} References papers
        </div>
      );
    } else if (!!searchCited) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.citedIconWrapper} icon="CITED" />
          {numberWithCommas(totalElements)} Cited Papers
        </div>
      );
    } else {
      return null;
    }

    return (
      <div className={styles.inflowRouteContainer}>
        {inflowQueryResult}
        <div className={styles.inflowArticleInfo}>of {targetPaper.title}</div>
        <div className={styles.separatorLine} />
      </div>
    );
  };
}
export default connect(mapStateToProps)(ArticleSearch);
