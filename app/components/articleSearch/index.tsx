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

const styles = require("./articleSearch.scss");

interface IArticleSearchContainerProps extends DispatchProp<IArticleSearchContainerMappedState> {
  articleSearchState: IArticleSearchStateRecord;
  search: IPapersRecord;
  routing: RouteProps;
}

interface IArticleSearchContainerMappedState {
  articleSearchState: IArticleSearchStateRecord;
  search: IPapersRecord;
  routing: RouteProps;
}

function mapStateToProps(state: IAppState) {
  return {
    articleSearchState: state.articleSearch,
    search: selectPapers(state.papers, state.articleSearch.searchItemsToShow),
    routing: state.routing,
  };
}

class ArticleSearch extends React.Component<IArticleSearchContainerProps, null> {
  private cancelTokenSource: CancelTokenSource;

  public componentDidMount() {
    const { search } = this.props;

    const CancelToken = axios.CancelToken;
    this.cancelTokenSource = CancelToken.source();

    const searchParams = this.getSearchParams();
    const searchQueryParam = searchParams.get("query");
    const searchPage = parseInt(searchParams.get("page"), 10) - 1 || 0;
    if (searchQueryParam !== "" && !!searchQueryParam && search.isEmpty()) {
      this.fetchSearchItems(searchQueryParam, searchPage);
    }
  }

  private fetchSearchItems = async (text: string, page: number) => {
    const { dispatch, articleSearchState } = this.props;

    if (!articleSearchState.isLoading) {
      await dispatch(
        Actions.getPapers({
          page,
          text,
          cancelTokenSource: this.cancelTokenSource,
        }),
      );
    }
  };

  public componentWillMount() {
    const searchParams = this.getSearchParams();
    const searchQueryParam = searchParams.get("query");

    this.changeSearchInput(searchQueryParam || "");
  }

  public componentWillUpdate(nextProps: IArticleSearchContainerProps) {
    const beforeSearch = this.props.routing.location.search;
    const afterSearch = nextProps.routing.location.search;

    if (beforeSearch !== afterSearch) {
      const afterSearchParams = new URLSearchParams(afterSearch);
      const afterSearchQuery = afterSearchParams.get("query");
      const afterSearchPage = parseInt(afterSearchParams.get("page"), 10) - 1 || 0;

      this.changeSearchInput(afterSearchQuery || "");
      if (afterSearchQuery !== "" && !!afterSearchQuery) {
        this.fetchSearchItems(afterSearchQuery, afterSearchPage);
      }
    }
  }

  private getSearchParams = () => {
    const { routing } = this.props;
    const locationSearch = routing.location.search;

    return new URLSearchParams(locationSearch);
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private handleSearchPush = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(Actions.handleSearchPush(articleSearchState.searchInput));
  };

  private mapPaperNode = (papers: IPapersRecord, searchItemsInfo: ISearchItemsInfo) => {
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

  private getInflowRoute = () => {
    const searchParams = this.getSearchParams();
    const searchReferenceParam = searchParams.get("reference");
    const searchCitedParam = searchParams.get("cited");
    const mockInflowArticleName = "Apoptosis of malignant human B cells by ligation of CD20 with monoclonal antibodies";
    let inflowQueryResult;

    if (searchReferenceParam !== "" && !!searchReferenceParam) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.referenceIconWrapper} icon="REFERENCE" />
          24 References papers
        </div>
      );
    } else if (searchCitedParam !== "" && !!searchCitedParam) {
      inflowQueryResult = (
        <div className={styles.inflowRoute}>
          <Icon className={styles.citedIconWrapper} icon="CITED" />
          1024 Cited Papers
        </div>
      );
    } else {
      return null;
    }

    return (
      <div className={styles.inflowRouteContainer}>
        {inflowQueryResult}
        <div className={styles.inflowArticleInfo}>of {mockInflowArticleName}</div>
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
    const searchPageParam = parseInt(searchParams.get("page"), 10) - 1;
    const searchQueryParam = searchParams.get("query");
    const searchReferenceParam = searchParams.get("reference");
    const searchCitedParam = searchParams.get("cited");

    if (isLoading) {
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.loadingContainer}>
            <ArticleSpinner className={styles.loadingSpinner} />
            <div className={styles.loadingContent}>Loading paper information</div>
          </div>
        </div>
      );
    } else if (searchQueryParam === "" || !searchQueryParam) {
      return (
        <div className={styles.articleSearchContainer}>
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
              <div className={styles.infoList}>
                <div className={styles.infoBox}>
                  <div className={styles.title}>Intuitive Feed</div>
                  <div className={styles.content}>
                    Quickly skim through the search results with major indices on the authors and the article.
                  </div>
                </div>
                <div className={styles.infoBox}>
                  <div className={styles.title}>Powered by community</div>
                  <div className={styles.content}>
                    Comments on the paper make it easy to find meaningful papers that can be applied to my research
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (articleSearchState.searchItemsToShow.isEmpty()) {
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.noPapersContainer}>
            <div className={styles.noPapersTitle}>No Papers Found :(</div>
            <div className={styles.noPapersContent}>
              Sorry, there are no results for <span className={styles.keyword}>[{searchQueryParam}].</span>
            </div>
          </div>
        </div>
      );
    } else if (
      (searchQueryParam !== "" && !!searchQueryParam) ||
      (searchReferenceParam !== "" && !!searchReferenceParam) ||
      (searchCitedParam !== "" && !!searchCitedParam)
    ) {
      const currentPage: number = searchPageParam || 0;

      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.innerContainer}>
            {this.getInflowRoute()}
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>{totalElements} results</span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>
                {currentPage + 1} of {totalPages} pages
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
            {this.mapPaperNode(searchItemsToShow, searchItemsInfo)}
            <Pagination totalPages={totalPages} currentPage={currentPage} searchQueryParam={searchQueryParam} />
          </div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
