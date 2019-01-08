import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { debounce } from "lodash";
import Helmet from "react-helmet";
import * as Actions from "../articleSearch/actions";
import { AppState } from "../../reducers";
import { Footer } from "../layouts";
import { LayoutState, UserDevice } from "../layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
import { HomeState } from "./records";
import { getKeywordCompletion, clearKeywordCompletion, openKeywordCompletion } from "./actions";
import ActionTicketManager from "../../helpers/actionTicketManager";
import InputWithSuggestionList from "../common/InputWithSuggestionList";
import Icon from "../../icons";
const styles = require("./home.scss");

export interface HomeProps {
  layout: LayoutState;
  home: HomeState;
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    home: state.home,
  };
}

@withStyles<typeof Home>(styles)
class Home extends React.PureComponent<HomeProps> {
  public componentDidMount() {
    this.clearSearchInput();
  }

  public render() {
    const { layout, home } = this.props;

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
              <div tabIndex={0} className={styles.searchInputForm}>
                <InputWithSuggestionList
                  autoFocus={true}
                  onChange={this.handleChangeSearchInput}
                  placeholder={searchBoxPlaceHolder}
                  handleSubmit={this.handleSearchPush}
                  suggestionList={home.completionKeywordList.map(keyword => keyword.keyword)}
                  wrapperStyle={{
                    backgroundColor: "white",
                    boxShadow: "rgba(0, 0, 0, 0.15) 0px 3px 8px 1px",
                  }}
                  style={{
                    display: "flex",
                    width: "590px",
                    height: "44px",
                    border: 0,
                    borderRadius: "4px",
                    backgroundColor: "white",
                    overflow: "hidden",
                    alignItems: "center",
                    paddingLeft: "16px",
                  }}
                  listWrapperStyle={{
                    boxShadow: "0 1px 2px 0 #bbc2d0",
                  }}
                  listItemStyle={{
                    height: "44px",
                    lineHeight: "44px",
                    padding: "0 18px",
                  }}
                  iconNode={<Icon icon="SEARCH_ICON" className={styles.searchIcon} />}
                />
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

  private handleChangeSearchInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { dispatch } = this.props;
    const searchInput = e.currentTarget.value;

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
  private delayedGetKeywordCompletion = debounce(this.getKeywordCompletion, 200);

  private handleSearchPush = (query: string) => {
    const { dispatch } = this.props;

    ActionTicketManager.trackTicket({
      pageType: "home",
      actionType: "fire",
      actionArea: "home",
      actionTag: "query",
      actionLabel: query,
    });

    dispatch(Actions.handleSearchPush(query));
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
