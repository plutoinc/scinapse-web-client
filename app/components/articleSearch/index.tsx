import * as React from "react";
import { InputBox } from "../common/inputBox/inputBox";
import { DispatchProp, connect } from "react-redux";
import { IArticleSearchStateRecord } from "./records";
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
  private searchParams: URLSearchParams;

  public componentWillMount() {
    const { routing } = this.props;
    const locationSearch = routing.location.search;
    this.searchParams = new URLSearchParams(locationSearch);
    console.log("componentWillMount");
    const searchQueryParam = this.searchParams.get("query");
    this.changeSearchInput(searchQueryParam);
  }

  public shouldComponentUpdate(nextProps: IArticleSearchContainerProps) {
    this.props.routing.location.search !== nextProps.routing.location.search;
    const beforeSearchQueryParam = new URLSearchParams(this.props.routing.location.search).get("query");
    const afterSearchQueryParam = new URLSearchParams(nextProps.routing.location.search).get("query");

    if (beforeSearchQueryParam !== afterSearchQueryParam) {
      this.searchParams = new URLSearchParams(nextProps.routing.location.search);
      this.changeSearchInput(afterSearchQueryParam);

      return true;
    }
    return false;
  }

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
    const searchPageParam = this.searchParams.get("page");
    const searchQueryParam = this.searchParams.get("query");
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

  public render() {
    const { articleSearchState } = this.props;
    const { searchInput } = articleSearchState;
    const searchQueryParam = this.searchParams.get("query");

    if (searchQueryParam === "" || !searchQueryParam) {
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
    } else {
      const mockArticle = recordifyArticle(initialArticle);
      const mockArticles: IArticlesRecord = List([mockArticle, mockArticle, mockArticle]);

      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.innerContainer}>
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>30,624 results</span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>2 of 3062 pages</span>
            </div>
            {this.mapArticleNode(mockArticles)}
            {this.getPagination()}
          </div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
