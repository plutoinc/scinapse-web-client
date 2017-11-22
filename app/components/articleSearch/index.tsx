import * as React from "react";
import { InputBox } from "../common/inputBox/inputBox";
import { DispatchProp, connect } from "react-redux";
import { IArticleSearchStateRecord } from "./records";
import { IAppState } from "../../reducers";
import * as Actions from "./actions";
import { push } from "react-router-redux";
import { RouteComponentProps } from "react-router";

const styles = require("./articleSearch.scss");

interface IArticleSearchParams {
  query?: string;
}

interface IArticleSearchContainerProps
  extends RouteComponentProps<IArticleSearchParams>,
    DispatchProp<IArticleSearchContainerMappedState> {
  articleSearchState: IArticleSearchStateRecord;
}

interface IArticleSearchContainerMappedState {
  articleSearchState: IArticleSearchStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    articleSearchState: state.articleSearch
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

  public render() {
    const { articleSearchState } = this.props;
    const { searchInput } = articleSearchState;
    const searchQueryParam = this.props.match.params.query;

    if (searchQueryParam === "" || searchQueryParam === undefined) {
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
      return (
        <div className={styles.articleSearchContainer}>
          <div className={styles.innerContainer}>dskjffdsjklfjdklfjkl</div>
        </div>
      );
    }
  }
}
export default connect(mapStateToProps)(ArticleSearch);
