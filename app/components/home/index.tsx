import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router";
import Helmet from "react-helmet";
import { AppState } from "../../reducers";
import { Footer } from "../layouts";
import { LayoutState, UserDevice } from "../layouts/records";
import { withStyles } from "../../helpers/withStylesHelper";
import SearchQueryInput from "../common/InputWithSuggestionList/searchQueryInput";
const styles = require("./home.scss");

export interface HomeProps extends RouteComponentProps<null> {
  layout: LayoutState;
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
  };
}

@withStyles<typeof Home>(styles)
class Home extends React.PureComponent<HomeProps> {
  public render() {
    const containerStyle = this.getContainerStyle();

    return (
      <div className={styles.articleSearchFormContainer}>
        {this.getHelmetNode()}
        <h1 style={{ display: "none" }}>Scinapse | Academic search engine for paper</h1>
        <div className={styles.searchFormInnerContainer}>
          <div className={styles.searchFormContainer}>
            <div className={styles.formWrapper}>
              <div className={styles.searchTitle}>
                <span className={styles.searchTitleText}> Do Research, Never Re-search</span>
                <img src="https://assets.pluto.network/scinapse/circle%403x.png" className={styles.circleImage} />
                <img src="https://assets.pluto.network/scinapse/underline%403x.png" className={styles.underlineImage} />
              </div>
              <div className={styles.searchSubTitle}>
                Scinapse is a free, nonprofit, Academic search engine <br /> for papers, serviced by{" "}
                <a href="https://pluto.network" target="_blank" className={styles.plutoLink} rel="noopener">
                  Pluto Network
                </a>
              </div>
              <div tabIndex={0} className={styles.searchInputForm}>
                <SearchQueryInput actionArea="home" autoFocus />
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
              <div className={styles.featureName}>Save to Collection</div>
              <div className={styles.featureContents}>
                When you meet interesting papers, just save it to your Collection.
              </div>
            </div>
          </div>
          <div className={styles.sourceVendorContainer}>
            <div className={styles.sourceVendorSubtitle}>Metadata of papers comes from</div>
            <div className={styles.sourceVendorWrapper}>
              <div className={styles.sourceVendorItem}>
                <a href="https://aka.ms/msracad" target="_blank" rel="noopener">
                  <img src="https://assets.pluto.network/scinapse/microsoft-research.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.semanticscholar.org/" target="_blank" rel="noopener">
                  <img src="https://assets.pluto.network/scinapse/semantic-scholar%402x.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.springernature.com/gp/" target="_blank" rel="noopener">
                  <img src="https://assets.pluto.network/scinapse/springernature%402x.png" />
                </a>
              </div>
              <div className={styles.sourceVendorItem}>
                <a href="https://www.ncbi.nlm.nih.gov/pubmed/" target="_blank" rel="noopener">
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

  private getHelmetNode = () => {
    const structuredDataJSON = {
      "@context": "http://schema.org",
      "@type": "Organization",
      url: "https://scinapse.io",
      logo: "https://s3.amazonaws.com/pluto-asset/scinapse/scinapse-logo.png",
    };

    return <Helmet script={[{ type: "application/ld+json", innerHTML: JSON.stringify(structuredDataJSON) }]} />;
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

export default withRouter(connect(mapStateToProps)(Home));
