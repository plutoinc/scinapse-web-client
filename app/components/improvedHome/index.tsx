import { hot } from 'react-hot-loader/root';
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import ReactCountUp from 'react-countup';
import { AppState } from '../../reducers';
import { LayoutState, UserDevice } from '../layouts/records';
import { withStyles } from '../../helpers/withStylesHelper';
import SearchQueryInput from '../common/InputWithSuggestionList/searchQueryInput';
import TrendingPaper from '../home/components/trendingPaper';
import { getUserGroupName } from '../../helpers/abTestHelper';
import { SEARCH_ENGINE_MOOD_TEST } from '../../constants/abTestGlobalValue';
import Icon from '../../icons';
import JournalsInfo from './components/journalsInfo';
import AffiliationsInfo from './components/affiliationsInfo';
import homeAPI from '../../api/home';
import ImprovedFooter from '../layouts/improvedFooter';
import RecommendedPapers from './components/recommendedPapers';
const styles = require('./improvedHome.scss');

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

const ImprovedHome: React.FC<Props> = props => {
  const [isSearchEngineMood, setIsSearchEngineMood] = React.useState(false);
  const [papersFoundCount, setPapersFoundCount] = React.useState(0);

  React.useEffect(() => {
    setIsSearchEngineMood(getUserGroupName(SEARCH_ENGINE_MOOD_TEST) === 'searchEngine');
    homeAPI.getPapersFoundCount().then(res => {
      setPapersFoundCount(res.data.content);
    });
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
                inputClassName={isSearchEngineMood ? styles.searchEngineMoodInput : styles.searchInput}
              />
            </div>
            <div className={styles.searchTryKeyword} />
            <div className={styles.catchphrase}>We’re better than Google Scholar. We mean it.</div>
            <div className={styles.cumulativeCountContainer}>
              <span>
                <b>50,000+</b> researcher users.
              </span>
              <br />
              <span>
                Over{' '}
                <b>
                  <ReactCountUp
                    start={papersFoundCount > 10000 ? papersFoundCount - 10000 : papersFoundCount}
                    end={papersFoundCount}
                    separator=","
                    duration={3}
                  />
                </b>{' '}
                papers searched this month.
              </span>
            </div>
            <Icon icon="ARROW_POINT_TO_DOWN" className={styles.downIcon} />
          </div>
        </div>
        <RecommendedPapers isLoggedIn={props.currentUser.isLoggedIn} isLoggingIn={props.currentUser.isLoggingIn} />
        {!props.currentUser.isLoggedIn ||
          (props.layout.userDevice !== UserDevice.DESKTOP && (
            <div>
              <JournalsInfo isMobile={props.layout.userDevice === UserDevice.MOBILE} />
              <AffiliationsInfo />
              <div className={styles.contentBlockDivider} />
              <div className={styles.trendingPaperWrapper}>
                <TrendingPaper />
              </div>
            </div>
          ))}

        <ImprovedFooter />
      </div>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    currentUser: state.currentUser,
  };
}

export default hot(withRouter(connect(mapStateToProps)(withStyles<typeof ImprovedHome>(styles)(ImprovedHome))));
