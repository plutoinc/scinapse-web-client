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
import Icon from "../../icons";
import ArticleSpinner from "../common/spinner/articleSpinner";
import Pagination from "./components/pagination";
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

const mockTotalPages = 25;
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
    const { searchInput, isLoading } = articleSearchState;
    const searchParams = this.getSearchParams();
    const searchPageParam = searchParams.get("page");
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
    } else if (
      (searchQueryParam !== "" && !!searchQueryParam) ||
      (searchReferenceParam !== "" && !!searchReferenceParam) ||
      (searchCitedParam !== "" && !!searchCitedParam)
    ) {
      const mockArticle = recordifyArticle(initialArticle);
      const mockArticles: IArticlesRecord = List([mockArticle, mockArticle, mockArticle]);
      const currentPage: number = parseInt(searchPageParam, 10) || 1;

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
            <Pagination totalPages={mockTotalPages} currentPage={currentPage} searchQueryParam={searchQueryParam} />
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
    //   return (
    // <div className={styles.articleSearchContainer}>
    //   <div className={styles.noPapersContainer}>
    //     <div className={styles.noPapersTitle}>No Papers Found :(</div>
    //     <div className={styles.noPapersContent}>
    //       Sorry, there are no results for <span className={styles.keyword}>[검색어].</span>
    //     </div>
    //   </div>
    // </div>
    //   );
    // }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
