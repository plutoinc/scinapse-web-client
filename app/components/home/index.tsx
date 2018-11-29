import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { debounce } from "lodash";
import { push } from "connected-react-router";
import Helmet from "react-helmet";
import * as Actions from "../articleSearch/actions";
import PapersQueryFormatter from "../../helpers/papersQueryFormatter";
import SuggestionList from "../layouts/components/suggestionList";
import InputBox from "../common/inputBox/inputBox";
import { AppState } from "../../reducers";
import { Footer } from "../layouts";
import { LayoutState, UserDevice } from "../layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
import { HomeState } from "./records";
import { getKeywordCompletion, closeKeywordCompletion, clearKeywordCompletion, openKeywordCompletion } from "./actions";
const styles = require("./home.scss");

export interface HomeProps {
  layout: LayoutState;
  home: HomeState;
  dispatch: Dispatch<any>;
}

export interface HomeMappedState {
  layout: LayoutState;
  home: HomeState;
}

interface HomeStates
  extends Readonly<{
      searchKeyword: string;
    }> {}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    home: state.home,
  };
}

@withStyles<typeof Home>(styles)
class Home extends React.PureComponent<HomeProps, HomeStates> {
  constructor(props: HomeProps) {
    super(props);

    this.state = {
      searchKeyword: "",
    };
  }

  public componentDidMount() {
    this.clearSearchInput();
  }

  public render() {
    const { layout, home } = this.props;
    const { searchKeyword } = this.state;

    const containerStyle = this.getContainerStyle();
    const searchBoxPlaceHolder =
      layout.userDevice !== UserDevice.DESKTOP
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
                Sci-napse is a free, nonprofit, Academic search engine <br /> for papers, serviced by{" "}
                <a href="https://pluto.network" target="_blank" className={styles.plutoLink}>
                  Pluto Network
                </a>
              </div>
              <div tabIndex={0} onBlur={this.handleSearchInputBlur}>
                <form className={styles.searchInputForm} onSubmit={this.handleSubmitSearch}>
                  <InputBox
                    autoFocus={true}
                    onChangeFunc={this.changeSearchInput}
                    defaultValue={searchKeyword}
                    placeHolder={searchBoxPlaceHolder}
                    type="search"
                    className={styles.inputBox}
                    onClickFunc={this.handleSearchPush}
                    onKeyDown={this.handleKeydown}
                  />
                  <SuggestionList
                    handleClickSuggestionKeyword={this.handleClickCompletionKeyword}
                    userInput={searchKeyword}
                    isOpen={home.isKeywordCompletionOpen}
                    suggestionList={home.completionKeywordList.map(keyword => keyword.keyword)}
                    isLoadingKeyword={home.isLoadingKeywordCompletion}
                  />
                </form>
              </div>
              <div className={styles.searchTryKeyword} />
            </div>
          </div>
          <div className={styles.featureWrapper}>
            <div className={styles.featureItem}>
              <div className={styles.featureName}>Intuitive Feed</div>
              <div className={styles.featureContents}>
                Quickly skim through the search results with major indices on the authors and the article.
              </div>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureName}>Powered by community</div>
              <div className={styles.featureContents}>
                Comments on the paper make it easy to find relevant papers for my research and comprehend them better
              </div>
            </div>
          </div>
          <div className={styles.sourceVendorContainer}>
            <div className={styles.sourceVendorSubtitle}>Metadata of papers comes from</div>
            <div className={styles.sourceVendorWrapper}>
              <div className={styles.sourceVendorItem}>
                <a href="https://aka.ms/msracad" target="_blank">
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

  private handleSearchInputBlur = (e: React.FocusEvent) => {
    const { dispatch } = this.props;

    const nextTarget: any = e.relatedTarget;
    if (nextTarget && nextTarget.className && nextTarget.className.includes("keywordCompletionItem")) {
      return;
    }

    dispatch(closeKeywordCompletion());
  };

  private handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.handleSearchPush();
  };

  private handleClickCompletionKeyword = (suggestion: string) => {
    const { dispatch } = this.props;

    const targetSearchQueryParams = PapersQueryFormatter.stringifyPapersQuery({
      query: suggestion,
      page: 1,
      sort: "RELEVANCE",
      filter: {},
    });

    dispatch(push(`/search?${targetSearchQueryParams}`));
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

    this.setState({
      searchKeyword: searchInput,
    });

    if (searchInput.length > 1) {
      this.delayedGetKeywordCompletion(searchInput);
      dispatch(openKeywordCompletion);
    } else if (searchInput.length <= 1) {
      dispatch(clearKeywordCompletion());
    }
  };

  private getKeywordCompletion = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(getKeywordCompletion(searchInput));
  };

  // tslint:disable-next-line:member-ordering
  private delayedGetKeywordCompletion = debounce(this.getKeywordCompletion, 500);

  private handleSearchPush = () => {
    const { dispatch } = this.props;
    const { searchKeyword } = this.state;

    dispatch(Actions.handleSearchPush(searchKeyword));
  };

  private getContainerStyle = (): React.CSSProperties => {
    const { layout } = this.props;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return { position: "absolute", margin: "0 0 9px 0", width: "100%" };
    } else {
      return {};
    }
  };
}

export default connect(mapStateToProps)(Home);
