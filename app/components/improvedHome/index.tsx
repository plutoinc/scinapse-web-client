import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Helmet from 'react-helmet';
import ReactCountUp from 'react-countup';
import { AppState } from '../../reducers';
import SearchQueryInput from '../common/InputWithSuggestionList/searchQueryInput';
import TrendingPaper from './components/trendingPaper';
import Icon from '../../icons';
import JournalsInfo from './components/journalsInfo';
import AffiliationsInfo from './components/affiliationsInfo';
import HomeAPI from '../../api/home';
import ImprovedFooter from '../layouts/improvedFooter';
import { UserDevice } from '../layouts/reducer';
const useStyles = require('isomorphic-style-loader/useStyles');
const styles = require('./improvedHome.scss');

const MAX_KEYWORD_SUGGESTION_LIST_COUNT = 5;

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

const ScinapseInformation: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  return (
    <div>
      <JournalsInfo isMobile={isMobile} />
      <AffiliationsInfo />
      <div className={styles.contentBlockDivider} />
      <div className={styles.trendingPaperWrapper}>
        <TrendingPaper />
      </div>
    </div>
  );
};

const ScinapseFigureContent: React.FC<{ papersFoundCount: number }> = ({ papersFoundCount }) => {
  return (
    <>
      <div className={styles.cumulativeCountContainer}>
        <span>
          <b>50,000+</b> registered researchers have found
        </span>
        <br />
        <span>
          <b>
            <ReactCountUp
              start={papersFoundCount > 10000 ? papersFoundCount - 10000 : papersFoundCount}
              end={papersFoundCount}
              separator=","
              duration={3}
            />
            {`+`}
          </b>
          {` papers using Scinapse`}
        </span>
      </div>
      <Icon icon="ARROW_DOWN" className={styles.downIcon} />
    </>
  );
};

const ImprovedHome: React.FC = () => {
  useStyles(styles);
  const userDevice = useSelector((state: AppState) => state.layout.userDevice);
  const [papersFoundCount, setPapersFoundCount] = React.useState(0);
  const cancelToken = React.useRef(axios.CancelToken.source());

  React.useEffect(() => {
    HomeAPI.getPapersFoundCount().then(res => {
      setPapersFoundCount(res.data.content);
    });

    return () => {
      cancelToken.current.cancel();
      cancelToken.current = axios.CancelToken.source();
    };
  }, []);

  return (
    <div className={styles.articleSearchFormContainer}>
      {getHelmetNode()}
      <h1 style={{ display: 'none' }}>Scinapse | Academic search engine for paper</h1>
      <div className={styles.searchFormInnerContainer}>
        <div className={styles.searchFormContainer}>
          <div className={styles.formWrapper}>
            <div className={styles.title}>
              <Icon icon="SCINAPSE_HOME_LOGO" className={styles.scinapseHomeLogo} />
            </div>
            <div className={styles.subTitle}>Academic Search Engine</div>
            <div tabIndex={0} className={styles.searchInputForm}>
              <SearchQueryInput
                maxCount={MAX_KEYWORD_SUGGESTION_LIST_COUNT}
                actionArea="home"
                autoFocus
                inputClassName={styles.searchInput}
              />
            </div>
            <div className={styles.searchTryKeyword} />
            <div className={styles.catchphrase}>We’re better than Google Scholar. We mean it.</div>
            <ScinapseFigureContent papersFoundCount={papersFoundCount} />
          </div>
        </div>
        <ScinapseInformation isMobile={userDevice === UserDevice.MOBILE} />
        <ImprovedFooter />
      </div>
    </div>
  );
};

export default ImprovedHome;
