import * as React from "react";
import { InputBox } from "../common/inputBox/inputBox";
import { DispatchProp, connect } from "react-redux";
import { IArticleSearchStateRecord, SEARCH_SORTING } from "./records";
import { IAppState } from "../../reducers";
import * as Actions from "./actions";
import { RouteProps } from "react-router";
import SearchItem from "./components/searchItem";
import { initialArticle, recordifyArticle, IArticlesRecord } from "../../model/article";
import { List } from "immutable";
import { Link } from "react-router-dom";
import Icon from "../../icons";

const styles = require("./articleSearch.scss");

interface IArticleSearchContainerProps extends DispatchProp<IArticleSearchContainerMappedState> {
  articleSearchState: IArticleSearchStateRecord;
  routing: RouteProps;
}

interface IArticleSearchContainerMappedState {
  articleSearchState: IArticleSearchStateRecord;
  routing: RouteProps;
}

function mapStateToProps(state: IAppState) {
  return {
    articleSearchState: state.articleSearch,
    routing: state.routing,
  };
}

class ArticleSearch extends React.Component<IArticleSearchContainerProps, null> {
  public componentWillMount() {
    const searchParams = this.getSearchParams();
    const searchQueryParam = searchParams.get("query");

    this.changeSearchInput(searchQueryParam || "");
  }

  public componentWillUpdate(nextProps: IArticleSearchContainerProps) {
    const beforeSearchQueryParam = new URLSearchParams(this.props.routing.location.search).get("query");
    const afterSearchQueryParam = new URLSearchParams(nextProps.routing.location.search).get("query");

    if (beforeSearchQueryParam !== afterSearchQueryParam) {
      this.changeSearchInput(afterSearchQueryParam || "");
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

  private mapArticleNode = (search: IArticlesRecord) => {
    const searchItems = search.map((article, index) => {
      return <SearchItem key={`article_${index}`} article={article} />;
    });

    return <div className={styles.searchItems}>{searchItems}</div>;
  };

  private getPagination = () => {
    const searchParams = this.getSearchParams();

    const searchPageParam = searchParams.get("page");
    const searchQueryParam = searchParams.get("query");
    const currentPage: number = parseInt(searchPageParam, 10) || 1;
    const mockTotalPages = 25;
    let startPage: number;
    let endPage: number;

    if (mockTotalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = mockTotalPages;
    } else {
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= mockTotalPages) {
        startPage = mockTotalPages - 9;
        endPage = mockTotalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    const pageRange = Array.from(Array(endPage - startPage + 1).keys()).map(i => i + startPage);

    return (
      <div className={styles.pagination}>
        {currentPage !== 1 ? (
          <div className={styles.prevButtons}>
            <Link to={`/search?query=${searchQueryParam}&page=1`} className={styles.pageIconButton}>
              <Icon icon="LAST_PAGE" />
            </Link>
            <Link to={`/search?query=${searchQueryParam}&page=${currentPage - 1}`} className={styles.pageIconButton}>
              <Icon icon="NEXT_PAGE" />
            </Link>
          </div>
        ) : null}

        {pageRange.map((page, index) => (
          <Link
            to={`/search?query=${searchQueryParam}&page=${page}`}
            key={`page_${index}`}
            className={page === currentPage ? `${styles.pageItem} ${styles.active}` : styles.pageItem}
          >
            {page}
          </Link>
        ))}
        {currentPage !== mockTotalPages ? (
          <div className={styles.nextButtons}>
            <Link to={`/search?query=${searchQueryParam}&page=${currentPage + 1}`} className={styles.pageIconButton}>
              <Icon icon="NEXT_PAGE" />
            </Link>
            <Link to={`/search?query=${searchQueryParam}&page=${mockTotalPages}`} className={styles.pageIconButton}>
              <Icon icon="LAST_PAGE" />
            </Link>
          </div>
        ) : null}
      </div>
    );
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
    const { searchInput } = articleSearchState;
    const searchParams = this.getSearchParams();
    const searchQueryParam = searchParams.get("query");
    const searchReferenceParam = searchParams.get("reference");
    const searchCitedParam = searchParams.get("cited");

    if (
      (searchQueryParam !== "" && !!searchQueryParam) ||
      (searchReferenceParam !== "" && !!searchReferenceParam) ||
      (searchCitedParam !== "" && !!searchCitedParam)
    ) {
      const mockArticle = recordifyArticle(initialArticle);
      const mockArticles: IArticlesRecord = List([mockArticle, mockArticle, mockArticle]);

      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.innerContainer}>
            {this.getInflowRoute()}
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>30,624 results</span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>2 of 3062 pages</span>
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
            {this.mapArticleNode(mockArticles)}
            {this.getPagination()}
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.innerContainer}>
            <form onSubmit={this.handleSearchPush} className={styles.searchFormContainer}>
              <InputBox
                onChangeFunc={this.changeSearchInput}
                defaultValue={searchInput}
                placeHolder="Type your search query..."
                type="search"
                className={styles.inputBox}
              />
            </form>
          </div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
