import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import NoSsr from '@material-ui/core/NoSsr';
import { AppState } from '../../reducers';
import { Footer } from '../layouts';
import { LayoutState, UserDevice } from '../layouts/records';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryInput from '../common/InputWithSuggestionList/searchQueryInput';
import TrendingPaper from './components/trendingPaper';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { SEARCH_ENGINE_MOOD_TEST, HOME_IMPROVEMENT_TEST } from '../../constants/abTestGlobalValue';
import ImprovedHome from '../improvedHome';
import { changeSearchQuery } from '../../actions/searchQuery';
const styles = require('./home.scss');

const MAX_KEYWORD_SUGGESTION_LIST_COUNT = 5;

type Props = ReturnType<typeof mapStateToProps> &
  RouteComponentProps<any> & {
    layout: LayoutState;
    dispatch: Dispatch<any>;
  };

function getHelmetNode() {
  const structuredDataJSON = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    url: 'https://scinapse.io',
    logo: 'https://s3.amazonaws.com/pluto-asset/scinapse/scinapse-logo.png',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        email: 'team@pluto.network',
        url: 'https://pluto.network',
        contactType: 'customer service',
      },
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://scinapse.io/search?query={search_term_string}&utm_source=google_search_result',
      'query-input': 'required name=search_term_string',
    },
    sameAs: [
      'https://www.facebook.com/PlutoNetwork',
      'https://twitter.com/pluto_network',
      'https://medium.com/pluto-network',
      'https://pluto.network',
    ],
  };

  return (
    <Helmet script={[{ type: 'application/ld+json', innerHTML: JSON.stringify(structuredDataJSON) }]}>
      <link rel="canonical" href="https://scinapse.io" />
    </Helmet>
  );
}

function getContainerStyle(layout: LayoutState): React.CSSProperties {
  if (layout.userDevice !== UserDevice.DESKTOP) {
    return { position: 'absolute', margin: '0 0 9px 0', width: '100%' };
  } else {
    return {};
  }
}

const Home: React.FC<Props> = props => {
  const [isSearchEngineMood, setIsSearchEngineMood] = React.useState(false);
  const [isImprovedHome, setIsImprovedHome] = React.useState(false);

  React.useEffect(() => {
    setIsSearchEngineMood(getUserGroupName(SEARCH_ENGINE_MOOD_TEST) === 'searchEngine');
    setIsImprovedHome(getUserGroupName(HOME_IMPROVEMENT_TEST) === 'improvement');
    props.dispatch(changeSearchQuery(''));
  }, []);

  const containerStyle = getContainerStyle(props.layout);

  return (
    <NoSsr>
      {isImprovedHome ? (
        <ImprovedHome />
      ) : (
        <div className={styles.articleSearchFormContainer}>
          {getHelmetNode()}
          <h1 style={{ display: 'none' }}>Scinapse | Academic search engine for paper</h1>
          <div className={styles.searchFormInnerContainer}>
            <div className={styles.searchFormContainer}>
              <div className={styles.formWrapper}>
                <div className={styles.searchTitle}>
                  <span className={styles.searchTitleText}> Do Research, Never Re-search</span>
                  <img
                    src="https://assets.pluto.network/scinapse/circle%402x.png"
                    className={styles.circleImage}
                    alt="home circle image"
                  />
                  <img
                    src="https://assets.pluto.network/scinapse/underline%402x.png"
                    className={styles.underlineImage}
                    alt="home underline image"
                  />
                </div>
                <div className={styles.searchSubTitle}>
                  Scinapse is a free, Academic search engine <br /> for papers, serviced by{' '}
                  <a
                    href="https://pluto.network"
                    target="_blank"
                    className={styles.plutoLink}
                    rel="noopener nofollow noreferrer"
                  >
                    Pluto Network
                  </a>
                </div>
                <div tabIndex={0} className={styles.searchInputForm}>
                  <SearchQueryInput
                    maxCount={MAX_KEYWORD_SUGGESTION_LIST_COUNT}
                    actionArea="home"
                    autoFocus
                    inputClassName={isSearchEngineMood ? styles.searchEngineMoodInput : styles.searchInput}
                  />
                </div>
                <div className={styles.searchTryKeyword} />
              </div>
            </div>
            <div className={styles.featureContainer}>
              <div className={styles.contextSubtitle}>SCINAPSE SPECIALITY</div>
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
            </div>
            <div className={styles.sourceVendorContainer}>
              <div className={styles.contentBlockDivider} />
              <div className={styles.contextSubtitle}>METADATA SOURCES</div>
              <div className={styles.sourceVendorWrapper}>
                <div className={styles.sourceVendorItem}>
                  <a href="https://aka.ms/msracad" target="_blank" rel="noopener nofollow noreferrer">
                    <picture>
                      <source srcSet="https://assets.pluto.network/scinapse/ms-research.webp" type="image/webp" />
                      <source srcSet="https://assets.pluto.network/scinapse/ms-research.jpg" type="image/jpeg" />
                      <img src="https://assets.pluto.network/scinapse/ms-research.jpg" alt="circle" />
                    </picture>
                  </a>
                </div>
                <div className={styles.sourceVendorItem}>
                  <a href="https://www.semanticscholar.org/" target="_blank" rel="noopener nofollow noreferrer">
                    <picture>
                      <source srcSet="https://assets.pluto.network/scinapse/semantic-scholar.webp" type="image/webp" />
                      <source srcSet="https://assets.pluto.network/scinapse/semantic-scholar.jpg" type="image/jpeg" />
                      <img src="https://assets.pluto.network/scinapse/semantic-scholar.jpg" alt="circle" />
                    </picture>
                  </a>
                </div>
                <div className={styles.sourceVendorItem}>
                  <a href="https://www.springernature.com/gp/" target="_blank" rel="noopener nofollow noreferrer">
                    <picture>
                      <source srcSet="https://assets.pluto.network/scinapse/springer-nature.webp" type="image/webp" />
                      <source srcSet="https://assets.pluto.network/scinapse/springer-nature.jpg" type="image/jpeg" />
                      <img src="https://assets.pluto.network/scinapse/springer-nature.jpg" alt="circle" />
                    </picture>
                  </a>
                </div>
                <div className={styles.sourceVendorItem}>
                  <a href="https://www.ncbi.nlm.nih.gov/pubmed/" target="_blank" rel="noopener nofollow noreferrer">
                    <picture>
                      <source srcSet="https://assets.pluto.network/scinapse/pub-med.webp" type="image/webp" />
                      <source srcSet="https://assets.pluto.network/scinapse/pub-med.jpg" type="image/jpeg" />
                      <img src="https://assets.pluto.network/scinapse/pub-med.jpg" alt="circle" />
                    </picture>
                  </a>
                </div>
              </div>
              <div className={styles.contentBlockDivider} />
            </div>
            <TrendingPaper />
            <Footer containerStyle={containerStyle} />
          </div>
        </div>
      )}
    </NoSsr>
  );
};

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
  };
}

export default hot(withRouter(connect(mapStateToProps)(withStyles<typeof Home>(styles)(Home))));
