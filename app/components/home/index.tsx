import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { debounce } from "lodash";
import { push } from "connected-react-router";
import Helmet from "react-helmet";
import * as Actions from "../articleSearch/actions";
import KeywordCompletion from "../layouts/components/keywordCompletion";
import InputBox from "../common/inputBox/inputBox";
import { AppState } from "../../reducers";
import { ArticleSearchState } from "../articleSearch/records";
import { Footer } from "../layouts";
import { LayoutState } from "../layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
import { HomeState } from "./records";
import { getKeywordCompletion, openKeywordCompletion, closeKeywordCompletion, clearKeywordCompletion } from "./actions";
const styles = require("./home.scss");

export interface HomeProps {
  layout: LayoutState;
  home: HomeState;
  articleSearchState: ArticleSearchState;
  dispatch: Dispatch<any>;
}

export interface HomeMappedState {
  layout: LayoutState;
  home: HomeState;
  articleSearchState: ArticleSearchState;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    articleSearchState: state.articleSearch,
    home: state.home,
  };
}

@withStyles<typeof Home>(styles)
class Home extends React.PureComponent<HomeProps, {}> {
  public componentDidMount() {
    this.clearSearchInput();
  }

  public render() {
    const { articleSearchState, layout, home } = this.props;
    const { searchInput } = articleSearchState;

    const containerStyle = this.getContainerStyle();
    const searchBoxPlaceHolder = layout.isMobile
      ? "Search papers by keyword"
      : "Search papers by title, author, doi or keyword";

    return (
      <div className={styles.articleSearchFormContainer}>
        {this.getHelmetNode()}
        <h1 style={{ display: "none" }}>Sci-napse | Academic search engine for paper</h1>
        <div className={styles.searchFormInnerContainer}>
          <div className={styles.searchFormContainer}>
            <div className={styles.formWrapper}>
              <div className={styles.searchTitle}>
                <span className={styles.searchTitleText}> Do Research, Never Re-search</span>
                <img src="https://assets.pluto.network/scinapse/circle%403x.png" className={styles.circleImage} />
                <img src="https://assets.pluto.network/scinapse/underline%403x.png" className={styles.underlineImage} />
              </div>
              <div className={styles.searchSubTitle}>
                Sci-napse is a free, nonprofit, Academic search engine <br /> for papers, serviced by Pluto Network
              </div>
              <div tabIndex={0} onFocus={this.handleSearchInputFocus} onBlur={this.handleSearchInputBlur}>
                <form className={styles.searchInputForm} onSubmit={this.handleSubmitSearch}>
                  <InputBox
                    autoFocus={true}
                    onChangeFunc={this.changeSearchInput}
                    defaultValue={searchInput}
                    placeHolder={searchBoxPlaceHolder}
                    type="search"
                    className={styles.inputBox}
                    onClickFunc={this.handleSearchPush}
                    onKeyDown={this.handleKeydown}
                  />
                  <KeywordCompletion
                    handleClickCompletionKeyword={this.handleClickCompletionKeyword}
                    query={articleSearchState.searchInput}
                    isOpen={home.isKeywordCompletionOpen}
                    keywordList={home.completionKeywordList}
                    isLoadingKeyword={home.isLoadingKeywordCompletion}
                  />
                </form>
              </div>
              <div className={styles.searchTryKeyword} />
            </div>
          </div>
          <div className={styles.featureWrapper}>
            <div className={styles.featureItem}>
              <div className={styles.featureNumber}>175m</div>
              <div className={styles.featureName}>Publications</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureNumber}>211m</div>
              <div className={styles.featureName}>Authors</div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureNumber}>48k</div>
              <div className={styles.featureName}>Journals</div>
            </div>
          </div>
          <div className={styles.sourceVendorContainer}>
            <div className={styles.sourceVendorSubtitle}>Metadata of papers comes from</div>
            <div className={styles.sourceVendorWrapper}>
              <div className={styles.sourceVendorItem}>
                <a href="https://academic.microsoft.com/" target="_blank">
                  <img src="https://assets.pluto.network/scinapse/microsoft-research.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.semanticscholar.org/" target="_blank">
                  <img src="https://assets.pluto.network/scinapse/semantic-scholar%402x.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.springernature.com/gp/" target="_blank">
                  <img src="https://assets.pluto.network/scinapse/springernature%402x.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.ncbi.nlm.nih.gov/pubmed/" target="_blank">
                  <img src="https://assets.pluto.network/scinapse/pubmed%402x.png" />
                </a>
              </div>
            </div>
          </div>
          <Footer containerStyle={containerStyle} />
        </div>
      </div>
    );
  }

  private handleKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 40) {
      // Down arrow
      e.preventDefault();

      const target: any =
        e.currentTarget.parentNode &&
        e.currentTarget.parentNode.nextSibling &&
        e.currentTarget.parentNode.nextSibling.firstChild;

      if (target) {
        target.focus();
      }
    }
  };

  private handleSearchInputFocus = () => {
    const { dispatch, articleSearchState } = this.props;

    if (!!articleSearchState.searchInput && articleSearchState.searchInput.length > 1) {
      dispatch(getKeywordCompletion(articleSearchState.searchInput));
      dispatch(openKeywordCompletion());
    }
  };

  private handleSearchInputBlur = () => {
    const { dispatch } = this.props;

    dispatch(closeKeywordCompletion());
  };

  private handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.handleSearchPush();
  };

  private handleClickCompletionKeyword = (path: string) => {
    const { dispatch } = this.props;

    dispatch(push(path));
  };

  private clearSearchInput = () => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(""));
  };

  private getHelmetNode = () => {
    const structuredDataJSON = {
      "@context": "http://schema.org",
      "@type": "Organization",
      url: "https://scinapse.io",
      logo: "https://s3.amazonaws.com/pluto-asset/scinapse/scinapse-logo.png",
    };

    return <Helmet script={[{ type: "application/ld+json", innerHTML: JSON.stringify(structuredDataJSON) }]} />;
  };

  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));

    if (searchInput.length > 1) {
      this.delayedGetKeywordCompletion(searchInput);
    } else if (searchInput.length < 1) {
      dispatch(clearKeywordCompletion());
    }
  };

  private getKeywordCompletion = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(getKeywordCompletion(searchInput));
  };

  // tslint:disable-next-line:member-ordering
  private delayedGetKeywordCompletion = debounce(this.getKeywordCompletion, 200);

  private handleSearchPush = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(Actions.handleSearchPush(articleSearchState.searchInput));
  };

  private getContainerStyle = (): React.CSSProperties => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return { position: "absolute", margin: "0 0 9px 0", width: "100%" };
    } else {
      return {};
    }
  };
}

export default connect(mapStateToProps)(Home);
