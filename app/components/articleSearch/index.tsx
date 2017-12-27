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
import FilterContainer from "./components/filterContainer";
import { IPapersRecord } from "../../model/paper";
import { trackAndOpenLink } from "../../helpers/handleGA";
import { ICurrentUserRecord } from "../../model/currentUser";
import checkAuthDialog from "../../helpers/checkAuthDialog";
import { parse } from "qs";
import { openVerificationNeeded } from "../dialog/actions";
import papersQueryFormatter from "../../helpers/papersQueryFormatter";
import numberWithCommas from "../../helpers/numberWithCommas";

const styles = require("./articleSearch.scss");

export enum SEARCH_FETCH_ITEM_MODE {
  QUERY,
  REFERENCES,
  CITED,
}

export enum SEARCH_FILTER_MODE {
  PUBLICATION_YEAR,
  JOURNAL_IF,
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

class ArticleSearch extends React.Component<IArticleSearchContainerProps, {}> {
  private cancelTokenSource: CancelTokenSource;

  public componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.cancelTokenSource = CancelToken.source();

    const searchParams = this.getSearchParams();
    const searchPage = parseInt(searchParams.page, 10) - 1 || 0;
    const searchQuery = searchParams.query;
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;

    // Scroll Restoration
    window.scrollTo(0, 0);

    if (!!searchQuery && !searchReferences && !searchCited) {
      this.fetchSearchItems({ query: searchQuery, page: searchPage, mode: SEARCH_FETCH_ITEM_MODE.QUERY });
    } else if (!!searchQuery && !!searchReferences) {
      this.fetchSearchItems({
        paperId: parseInt(searchReferences, 10),
        page: searchPage,
        mode: SEARCH_FETCH_ITEM_MODE.REFERENCES,
      });
    } else if (!!searchQuery && !!searchCited) {
      this.fetchSearchItems({
        paperId: parseInt(searchCited, 10),
        page: searchPage,
        mode: SEARCH_FETCH_ITEM_MODE.CITED,
      });
    }
  }

  private fetchSearchItems = async ({
    query,
    paperId,
    page,
    mode,
  }: {
    query?: string;
    paperId?: number;
    page: number;
    mode: SEARCH_FETCH_ITEM_MODE;
  }) => {
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
              paperId,
              cancelTokenSource: this.cancelTokenSource,
            }),
          );
          break;
        case SEARCH_FETCH_ITEM_MODE.REFERENCES:
          await dispatch(
            Actions.getReferencesPapers({
              page,
              paperId,
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

    if (!!searchParams.query) {
      const searchQueryObj = papersQueryFormatter.objectifyPapersQuery(searchParams.query);
      this.changeSearchInput(searchQueryObj.text || "");
    } else {
      this.changeSearchInput("");
    }
  }

  public componentWillUpdate(nextProps: IArticleSearchContainerProps) {
    const beforeSearch = this.props.routing.location.search;
    const afterSearch = nextProps.routing.location.search;

    if (beforeSearch !== afterSearch) {
      // Scroll Restoration
      window.scrollTo(0, 0);

      const afterSearchParams: IArticleSearchSearchParams = parse(afterSearch, { ignoreQueryPrefix: true });
      const afterSearchQuery = afterSearchParams.query;
      const afterSearchReferences = afterSearchParams.references;
      const afterSearchCited = afterSearchParams.cited;
      const afterSearchPage = parseInt(afterSearchParams.page, 10) - 1 || 0;

      if (!!afterSearchQuery) {
        const searchQueryObj = papersQueryFormatter.objectifyPapersQuery(afterSearchQuery);
        this.changeSearchInput(searchQueryObj.text || "");
      } else {
        this.changeSearchInput("");
      }

      if (!!afterSearchQuery) {
        this.fetchSearchItems({ query: afterSearchQuery, page: afterSearchPage, mode: SEARCH_FETCH_ITEM_MODE.QUERY });
      } else if (!!afterSearchQuery && !!afterSearchReferences) {
        this.fetchSearchItems({
          paperId: parseInt(afterSearchReferences, 10),
          page: afterSearchPage,
          mode: SEARCH_FETCH_ITEM_MODE.REFERENCES,
        });
      } else if (!!afterSearchQuery && !!afterSearchCited) {
        this.fetchSearchItems({
          paperId: parseInt(afterSearchCited, 10),
          page: afterSearchPage,
          mode: SEARCH_FETCH_ITEM_MODE.CITED,
        });
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

  private addFilter = (mode: SEARCH_FILTER_MODE, value: number) => {
    const { dispatch } = this.props;
    const searchParams = this.getSearchParams();
    let yearFrom, yearTo;

    switch (mode) {
      case SEARCH_FILTER_MODE.PUBLICATION_YEAR:
        if (!!value) {
          yearFrom = new Date().getFullYear() - value;
        }
        break;
      default:
        break;
    }

    if (!!searchParams.query) {
      const searchQueryObj = papersQueryFormatter.objectifyPapersQuery(searchParams.query);

      dispatch(Actions.addFilter({ text: searchQueryObj.text, yearFrom, yearTo }));
    }
  };

  private mapPaperNode = (papers: IPapersRecord, searchItemsInfo: ISearchItemsInfo, searchQueryText: string) => {
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
          isAuthorsOpen={searchItemsInfo.getIn([index, "isAuthorsOpen"])}
          toggleAuthors={() => {
            this.toggleAuthors(index);
          }}
          isTitleVisited={searchItemsInfo.getIn([index, "isTitleVisited"])}
          visitTitle={() => {
            this.visitTitle(index);
          }}
          handleCommentPost={() => {
            this.handleCommentPost(index, paper.id);
          }}
          isLoading={searchItemsInfo.getIn([index, "isLoading"])}
          searchQueryText={searchQueryText}
          isFirstOpen={searchItemsInfo.getIn([index, "isFirstOpen"])}
          closeFirstOpen={() => {
            this.closeFirstOpen(index);
          }}
          currentUser={currentUserState}
          deleteComment={(commentId: number) => {
            this.deleteComment(paper.id, commentId);
          }}
          getMoreComments={() => {
            this.getMoreComments(paper.id, searchItemsInfo.getIn([index, "page"]));
          }}
          isPageLoading={searchItemsInfo.getIn([index, "isPageLoading"])}
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

  private handleCommentPost = (index: number, paperId: number) => {
    const { dispatch, articleSearchState, currentUserState } = this.props;
    const comment = articleSearchState.searchItemsInfo.getIn([index, "commentInput"]);

    checkAuthDialog();
    if (currentUserState.isLoggedIn) {
      if (!currentUserState.oauthLoggedIn && !currentUserState.emailVerified) {
        dispatch(openVerificationNeeded());
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

    if (!!searchReferences) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
          {articleSearchState.searchItemsToShow.size} References papers
        </div>
      );
    } else if (!!searchCited) {
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

  private getMoreComments = (paperId: number, page: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.getMoreComments({ paperId, page, cancelTokenSource: this.cancelTokenSource }));
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
    const searchReferences = searchParams.references;
    const searchCited = searchParams.cited;
    const searchQuery = searchParams.query;
    let searchQueryObj;

    if (!!searchQuery) {
      searchQueryObj = papersQueryFormatter.objectifyPapersQuery(searchParams.query);
    }

    if (isLoading) {
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
            <div className={styles.loadingContent}>Loading paper information</div>
          </div>
        </div>
      );
    } else if (!searchQueryObj && !searchReferences && !searchCited) {
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

      if (!!searchQueryObj && !searchReferences && !searchCited) {
        noResultContent = `[${searchQueryObj.text}]`;
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
    } else if (!!searchQueryObj || (!!searchQueryObj || !!searchReferences) || (!!searchQueryObj && !!searchCited)) {
      const currentPageIndex: number = searchPage || 0;
      let publicationYearFilterValue;
      if (!!searchQueryObj.yearFrom) {
        publicationYearFilterValue = new Date().getFullYear() - searchQueryObj.yearFrom;
      }

      return (
        <div className={styles.articleSearchContainer}>
          <FilterContainer addFilter={this.addFilter} publicationYearFilterValue={publicationYearFilterValue} />
          <div className={styles.innerContainer}>
            {this.getInflowRoute()}
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>{numberWithCommas(totalElements)} results</span>
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
            {this.mapPaperNode(searchItemsToShow, searchItemsInfo, searchQueryObj.text)}
            <Pagination
              totalPageCount={totalPages}
              currentPageIndex={currentPageIndex}
              searchQueryText={searchQueryObj.text}
            />
          </div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
