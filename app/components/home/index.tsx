import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { debounce } from "lodash";
import { push } from "react-router-redux";
import Helmet from "react-helmet";
import * as Actions from "../articleSearch/actions";
import KeywordCompletion from "../layouts/components/keywordCompletion";
import InputBox from "../common/inputBox/inputBox";
import { AppState } from "../../reducers";
import { ArticleSearchStateRecord } from "../articleSearch/records";
import { Footer } from "../layouts";
import Icon from "../../icons";
import { LayoutStateRecord } from "../layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
import { HomeStateRecord } from "./records";
import { getKeywordCompletion, openKeywordCompletion, closeKeywordCompletion, clearKeywordCompletion } from "./actions";
const styles = require("./home.scss");

export interface HomeProps extends DispatchProp<HomeMappedState> {
  layout: LayoutStateRecord;
  home: HomeStateRecord;
  articleSearchState: ArticleSearchStateRecord;
}

export interface HomeMappedState {
  layout: LayoutStateRecord;
  home: HomeStateRecord;
  articleSearchState: ArticleSearchStateRecord;
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
                DO RESEARCH,<br /> NEVER RE-SEARCH
              </div>
              <div tabIndex={0} onFocus={this.handleSearchInputFocus} onBlur={this.handleSearchInputBlur}>
                <form className={styles.searchInputForm} onSubmit={this.handleSubmitSearch}>
                  <InputBox
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
              <div className={styles.searchSubTitle}>
                {`Sci-napse is a free, nonprofit, Academic search engine for papers, serviced by `}
                <a href="https://pluto.network" target="_blank" className={styles.plutoNetwork}>
                  Pluto Network.
                </a>
              </div>
              <div className={styles.searchTryKeyword} />
            </div>
          </div>
          <div className={styles.featureWrapper}>
            <div className={styles.featureItem}>
              <Icon className={styles.iconWrapper} icon="INTUITIVE_FEED" />
              <div className={styles.itemContents}>
                <div className={styles.itemTitle}>Intuitive Feed</div>
                <div className={styles.itemDetail}>
                  Quickly skim through the search results with major indices on the authors and the article.
                </div>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Icon className={styles.iconWrapper} icon="POWERED_BY_COMMUNITY" />
              <div className={styles.itemContents}>
                <div className={styles.itemTitle}>Powered by community</div>
                <div className={styles.itemDetail}>
                  Comments on the paper make it easy to find relevant papers for my research and comprehend them better
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer containerStyle={containerStyle} />
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

    if (!!articleSearchState.searchInput && articleSearchState.searchInput.length > 0) {
      dispatch(getKeywordCompletion(articleSearchState.searchInput));
    }
    dispatch(openKeywordCompletion());
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

  private getContainerStyle: () => React.CSSProperties = () => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return { position: "absolute", margin: "0 0 9px 0", width: "100%" };
    }
  };
}

export default connect(mapStateToProps)(Home);
