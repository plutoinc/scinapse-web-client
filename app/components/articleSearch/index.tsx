import * as React from "react";
import { InputBox } from "../common/inputBox/inputBox";
import { DispatchProp, connect } from "react-redux";
import { IArticleSearchStateRecord } from "./records";
import { IAppState } from "../../reducers";
import * as Actions from "./actions";
import { push } from "react-router-redux";
import { RouteProps } from "react-router";
import SearchItem from "./components/searchItem";
import { initialArticle, recordifyArticle } from "../../model/article";

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

class ArticleSearch extends React.PureComponent<IArticleSearchContainerProps, null> {
  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private handleSubmitReview = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(push(`/search?query=${articleSearchState.searchInput}`));
  };

  // private mapArticleNode = (feed: IArticlesRecord, feedState: IArticleFeedStateRecord) => {
  //   const searchItems = feed.map(article => {
  //     return <SearchItem key={`article_${article.id}`} article={article} />;
  //   });

  //   return (
  //     <div
  //     >
  //       {searchItems}
  //     </div>
  //   );
  // };

  public render() {
    const { articleSearchState, routing } = this.props;
    const { searchInput } = articleSearchState;
    const locationSearch = routing.location.search;
    const searchParams = new URLSearchParams(locationSearch);
    const searchQueryParam = searchParams.get("query");

    if (searchQueryParam === "" || !searchQueryParam) {
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.innerContainer}>
            <form onSubmit={this.handleSubmitReview} className={styles.formContainer}>
              <InputBox
                onChangeFunc={this.changeSearchInput}
                defaultValue={searchInput}
                placeHolder="Type your search query..."
                type="normal"
                className={styles.inputBox}
              />
              <button className={styles.searchButton} disabled={searchInput === ""} type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      );
    } else {
      const mockArticle = recordifyArticle(initialArticle);
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.innerContainer}>
            <div className={styles.searchSummary}>
              <span className={styles.searchResult}>30,624 results</span>
              <div className={styles.separatorLine} />
              <span className={styles.searchPage}>2 of 3062 pages</span>
            </div>
            <SearchItem article={mockArticle} />
          </div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
