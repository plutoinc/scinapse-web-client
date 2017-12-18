import * as React from "react";
import axios, { CancelTokenSource } from "axios";
import { DispatchProp, connect } from "react-redux";
import { RouteProps } from "react-router";
import { InputBox } from "../common/inputBox/inputBox";
import { IArticleSearchStateRecord, SEARCH_SORTING, ISearchItemsInfo } from "./records";
import { IAppState } from "../../reducers";
import * as Actions from "./actions";
import SearchItem from "./components/searchItem";
import Icon from "../../icons";
import ArticleSpinner from "../common/spinner/articleSpinner";
import Pagination from "./components/pagination";
import { IPapersRecord } from "../../model/paper";
import selectPapers from "./select";
import { trackAndOpenLink } from "../../helpers/handleGA";
import { ICurrentUserRecord } from "../../model/currentUser";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { parse } from "qs";

const styles = require("./articleSearch.scss");

export enum SEARCH_FETCH_ITEM_MODE {
  QUERY,
  REFERENCES,
  CITED,
}

interface IArticleSearchContainerProps extends DispatchProp<IArticleSearchContainerMappedState> {
  articleSearchState: IArticleSearchStateRecord;
  search: IPapersRecord;
  routing: RouteProps;
  currentUserState: ICurrentUserRecord;
}

interface IArticleSearchContainerMappedState {
  articleSearchState: IArticleSearchStateRecord;
  search: IPapersRecord;
  routing: RouteProps;
  currentUserState: ICurrentUserRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    articleSearchState: state.articleSearch,
    search: selectPapers(state.papers, state.articleSearch.searchItemsToShow),
    routing: state.routing,
    currentUserState: state.currentUser,
  };
}

export interface IArticleSearchSearchParams {
  query?: string;
  page?: string;
  references?: string;
  cited?: string;
}

class ArticleSearch extends React.Component<IArticleSearchContainerProps, null> {
  private cancelTokenSource: CancelTokenSource;

  public componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.cancelTokenSource = CancelToken.source();

    const searchParams = this.getSearchParams();
    console.log(searchParams);
    const searchPage = parseInt(searchParams.page, 10) - 1 || 0;
    const searchQuery = searchParams.query;
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;

    if (searchQuery !== "" && !!searchQuery) {
      this.fetchSearchItems(searchQuery, searchPage, SEARCH_FETCH_ITEM_MODE.QUERY);
    } else if (searchReferences !== "" && !!searchReferences) {
      this.fetchSearchItems(searchReferences, searchPage, SEARCH_FETCH_ITEM_MODE.REFERENCES);
    } else if (searchCited !== "" && !!searchCited) {
      this.fetchSearchItems(searchCited, searchPage, SEARCH_FETCH_ITEM_MODE.CITED);
    }
  }

  private fetchSearchItems = async (query: string, page: number, mode: SEARCH_FETCH_ITEM_MODE) => {
    const { dispatch, articleSearchState } = this.props;
    if (!articleSearchState.isLoading) {
      switch (mode) {
        case SEARCH_FETCH_ITEM_MODE.QUERY:
          await dispatch(
            Actions.getPapers({
              page,
              query,
              cancelTokenSource: this.cancelTokenSource,
            }),
          );
          break;
        case SEARCH_FETCH_ITEM_MODE.CITED:
          await dispatch(
            Actions.getCitedPapers({
              page,
              paperId: parseInt(query, 10),
              cancelTokenSource: this.cancelTokenSource,
            }),
          );
          break;
        case SEARCH_FETCH_ITEM_MODE.REFERENCES:
          await dispatch(
            Actions.getReferencesPapers({
              page,
              paperId: parseInt(query, 10),
              cancelTokenSource: this.cancelTokenSource,
            }),
          );
          break;
        default:
          break;
      }
    }
  };

  public componentWillMount() {
    const searchParams = this.getSearchParams();
    const searchQueryParam = searchParams.query;

    this.changeSearchInput(searchQueryParam || "");
  }

  public componentWillUpdate(nextProps: IArticleSearchContainerProps) {
    const beforeSearch = this.props.routing.location.search;
    const afterSearch = nextProps.routing.location.search;

    if (beforeSearch !== afterSearch) {
      const afterSearchParams: IArticleSearchSearchParams = parse(afterSearch, { ignoreQueryPrefix: true });
      const afterSearchQuery = afterSearchParams.query;
      const afterSearchReferences = afterSearchParams.references;
      const afterSearchCited = afterSearchParams.cited;
      const afterSearchPage = parseInt(afterSearchParams.page, 10) - 1 || 0;

      this.changeSearchInput(afterSearchQuery || "");

      if (afterSearchQuery !== "" && !!afterSearchQuery) {
        this.fetchSearchItems(afterSearchQuery, afterSearchPage, SEARCH_FETCH_ITEM_MODE.QUERY);
      } else if (afterSearchReferences !== "" && !!afterSearchReferences) {
        this.fetchSearchItems(afterSearchReferences, afterSearchPage, SEARCH_FETCH_ITEM_MODE.REFERENCES);
      } else if (afterSearchCited !== "" && !!afterSearchCited) {
        this.fetchSearchItems(afterSearchCited, afterSearchPage, SEARCH_FETCH_ITEM_MODE.CITED);
      }
    }
  }

  private getSearchParams = (): IArticleSearchSearchParams => {
    const { routing } = this.props;
    const locationSearch = routing.location.search;

    return parse(locationSearch, { ignoreQueryPrefix: true });
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private handleSearchPush = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { dispatch, articleSearchState } = this.props;

    dispatch(Actions.handleSearchPush(articleSearchState.searchInput));
  };

  private mapPaperNode = (papers: IPapersRecord, searchItemsInfo: ISearchItemsInfo, searchQuery: string) => {
    const { currentUserState } = this.props;

    const searchItems = papers.map((paper, index) => {
      return (
        <SearchItem
          key={`paper_${paper.id}`}
          paper={paper}
          commentInput={searchItemsInfo.getIn([index, "commentInput"])}
          changeCommentInput={(comment: string) => {
            this.changeCommentInput(index, comment);
          }}
          isAbstractOpen={searchItemsInfo.getIn([index, "isAbstractOpen"])}
          toggleAbstract={() => {
            this.toggleAbstract(index);
          }}
          isCommentsOpen={searchItemsInfo.getIn([index, "isCommentsOpen"])}
          toggleComments={() => {
            this.toggleComments(index);
          }}
          handleCommentPost={() => {
            this.handleCommentPost(index, paper.id);
          }}
          isLoading={searchItemsInfo.getIn([index, "isLoading"])}
          searchQuery={searchQuery}
          isFirstOpen={searchItemsInfo.getIn([index, "isFirstOpen"])}
          closeFirstOpen={() => {
            this.closeFirstOpen(index);
          }}
          currentUser={currentUserState}
          deleteComment={(commentId: number) => {
            this.deleteComment(paper.id, commentId);
          }}
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

  private handleCommentPost = (index: number, paperId: number) => {
    const { dispatch, articleSearchState, currentUserState } = this.props;
    const comment = articleSearchState.searchItemsInfo.getIn([index, "commentInput"]);

    checkAuthDialog();
    if (currentUserState.isLoggedIn) {
      if (!currentUserState.oauth && !currentUserState.emailVerified) {
        alert("Sorry, You have to email verify before posting comment. Check your mail list please.");
      } else {
        dispatch(Actions.handleCommentPost({ paperId, comment }));
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

  private getInflowRoute = () => {
    const { articleSearchState } = this.props;

    const searchParams = this.getSearchParams();
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;

    if (!articleSearchState.targetPaper || (!searchReferences && !searchCited)) {
      return;
    }

    let inflowQueryResult;

    if (searchReferences !== "" && !!searchReferences) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
          {articleSearchState.searchItemsToShow.size} References papers
        </div>
      );
    } else if (searchCited !== "" && !!searchCited) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.citedIconWrapper} icon="CITED" />
          {articleSearchState.searchItemsToShow.size} Cited Papers
        </div>
      );
    } else {
      return null;
    }

    return (
      <div className={styles.inflowRouteContainer}>
        {inflowQueryResult}
        <div className={styles.inflowArticleInfo}>of {articleSearchState.targetPaper.title}</div>
        <div className={styles.separatorLine} />
      </div>
    );
  };

  private handleChangeSorting = (sorting: SEARCH_SORTING) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSorting(sorting));
  };

  private getSortingContent = (sorting: SEARCH_SORTING) => {
    switch (sorting) {
      case SEARCH_SORTING.RELEVANCE:
        return "Relevance";
      case SEARCH_SORTING.LATEST:
        return "Latest";
      default:
        break;
    }
  };

  public render() {
    const { articleSearchState } = this.props;
    const {
      searchInput,
      isLoading,
      totalElements,
      totalPages,
      searchItemsToShow,
      searchItemsInfo,
    } = articleSearchState;
    const searchParams = this.getSearchParams();
    const searchPage = parseInt(searchParams.page, 10) - 1;
    const searchQuery = searchParams.query;
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;

    if (isLoading) {
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
            <div className={styles.loadingContent}>Loading paper information</div>
          </div>
        </div>
      );
    } else if (!searchQuery && !searchReferences && !searchCited) {
      return (
        <div className={styles.articleSearchFormContainer}>
          <div className={styles.searchFormBackground} />
          <div className={styles.searchFormInnerContainer}>
            <div className={styles.searchFormContainer}>
              <div className={styles.searchTitle}>Search Adaptive Paper at a Glance </div>
              <form onSubmit={this.handleSearchPush}>
                <InputBox
                  onChangeFunc={this.changeSearchInput}
                  defaultValue={searchInput}
                  placeHolder="Search papers"
                  type="search"
                  className={styles.inputBox}
                />
              </form>
              <div className={styles.searchSubTitle}>
                Papers is a free, nonprofit, academic discovery service of{" "}
                <a
                  onClick={() => {
                    trackAndOpenLink("https://pluto.network", "articleSearchSubTitle");
                  }}
                  className={styles.plutoNetwork}
                >
                  Pluto Network.
                </a>
              </div>
              <div className={styles.infoList}>
                <div className={styles.infoBox}>
                  <Icon className={styles.iconWrapper} icon="INTUITIVE_FEED" />
                  <div className={styles.infoContent}>
                    <div className={styles.title}>Intuitive Feed</div>
                    <div className={styles.content}>
                      Quickly skim through the search results with major indices on the authors and the article.
                    </div>
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <Icon className={styles.iconWrapper} icon="POWERED_BY_COMMUNITY" />
                  <div className={styles.infoContent}>
                    <div className={styles.title}>Powered by community</div>
                    <div className={styles.content}>
                      Comments on the paper make it easy to find meaningful papers that can be applied to my research
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (articleSearchState.searchItemsToShow.isEmpty()) {
      let noResultContent;

      if (!!searchQuery) {
        noResultContent = `[${searchQuery}]`;
      } else if (!!searchReferences) {
        if (!!articleSearchState.targetPaper) {
          noResultContent = `References of article [${articleSearchState.targetPaper.title}]`;
        } else {
          noResultContent = `References of article [${searchReferences}]`;
        }
      } else if (!!searchCited) {
        if (!!articleSearchState.targetPaper) {
          noResultContent = `Cited of article [${articleSearchState.targetPaper.title}]`;
        } else {
          noResultContent = `Cited of article [${searchCited}]`;
        }
      }

      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.noPapersContainer}>
            <div className={styles.noPapersTitle}>No Papers Found :(</div>
            <div className={styles.noPapersContent}>
              Sorry, there are no results for <span className={styles.keyword}>{noResultContent}.</span>
            </div>
          </div>
        </div>
      );
    } else if (!!searchQuery || !!searchReferences || !!searchCited) {
      const currentPageIndex: number = searchPage || 0;

      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.innerContainer}>
            {this.getInflowRoute()}
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>{totalElements} results</span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>
                {currentPageIndex + 1} of {totalPages} pages
              </span>
              <div className={styles.sortingBox}>
                <span className={styles.sortingContent}>Sort : </span>
                <select
                  className={styles.sortingSelect}
                  onChange={e => {
                    this.handleChangeSorting(parseInt(e.currentTarget.value, 10));
                  }}
                >
                  <option value={SEARCH_SORTING.RELEVANCE}>{this.getSortingContent(SEARCH_SORTING.RELEVANCE)}</option>
                  <option value={SEARCH_SORTING.LATEST}>{this.getSortingContent(SEARCH_SORTING.LATEST)}</option>
                </select>
              </div>
              <Icon className={styles.sortingIconWrapper} icon="OPEN_SORTING" />
            </div>
            {this.mapPaperNode(searchItemsToShow, searchItemsInfo, searchQuery)}
            <Pagination
              totalPageCount={totalPages}
              currentPageIndex={currentPageIndex}
              searchQueryParam={searchQuery}
            />
          </div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
