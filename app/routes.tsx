import * as React from 'react';
import loadable from '@loadable/component';
import { Route, Switch, match, withRouter, RouteComponentProps } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Dispatch } from 'redux';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { PaperShowMatchParams } from './containers/paperShow/types';
import { AuthorShowMatchParams } from './containers/authorShow/types';
import { JournalShowMatchParams } from './components/journalShow/types';
import { CollectionShowMatchParams } from './containers/collectionShow/types';
import ErrorPage from './components/error/errorPage';
import LocationListener from './components/locationListener';
import DeviceDetector from './components/deviceDetector';
import { withStyles } from './helpers/withStylesHelper';
import {
  HOME_PATH,
  SEARCH_RESULT_PATH,
  AUTHOR_SEARCH_RESULT_PATH,
  PAPER_SHOW_PATH,
  AUTHOR_SHOW_PATH,
  COLLECTION_SHOW_PATH,
  JOURNAL_SHOW_PATH,
  COLLECTION_LIST_PATH,
  AUTH_PATH,
  DESIGN_PATH,
  TERMS_OF_SERVICE_PATH,
  PRIVACY_POLICY_PATH,
  USER_SETTINGS_PATH,
  KEYWORD_SETTINGS_PATH,
} from './constants/routes';
import { AppState } from './reducers';
import ArticleSpinner from './components/common/spinner/articleSpinner';
const styles = require('./root.scss');

export interface LoadDataParams<P> {
  dispatch: Dispatch<any>;
  match: match<P>;
  pathname: string;
  queryParams?: any;
}

interface ServerRoutesMap {
  path?: string;
  component?: any;
  exact?: boolean;
  loadData?: (params: LoadDataParams<any>) => Promise<any>;
  render?: any;
}

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
      <ArticleSpinner />
    </div>
  );
};

export const routesMap: ServerRoutesMap[] = [
  {
    path: HOME_PATH,
    exact: true,
    component: loadable(() => import('./components/improvedHome'), {
      fallback: <LoadingSpinner />,
    }),
  },
  {
    path: SEARCH_RESULT_PATH,
    component: loadable(() => import('./components/articleSearch'), {
      fallback: <LoadingSpinner />,
    }),
    exact: true,
  },
  {
    path: AUTHOR_SEARCH_RESULT_PATH,
    component: loadable(() => import('./containers/authorSearch'), {
      fallback: <LoadingSpinner />,
    }),
    exact: true,
  },
  {
    path: PAPER_SHOW_PATH,
    component: loadable(() => import('./containers/paperShow'), {
      fallback: <LoadingSpinner />,
    }),
    loadData: async (params: LoadDataParams<PaperShowMatchParams>) => {
      const {
        fetchPaperShowData,
        fetchRefCitedPaperDataAtServer: fetchRefCitedPaperData,
      } = await import('./containers/paperShow/sideEffect');

      await Promise.all([fetchPaperShowData(params), fetchRefCitedPaperData(params)]);
    },
  },
  {
    path: AUTHOR_SHOW_PATH,
    component: loadable(() => import('./containers/authorShow'), {
      fallback: <LoadingSpinner />,
    }),
    loadData: async (params: LoadDataParams<AuthorShowMatchParams>) => {
      const { fetchAuthorShowPageData } = await import('./containers/authorShow/sideEffect');
      await Promise.all([fetchAuthorShowPageData(params)]);
    },
  },
  {
    path: COLLECTION_SHOW_PATH,
    component: loadable(() => import('./containers/collectionShow'), {
      fallback: <LoadingSpinner />,
    }),
    loadData: async (params: LoadDataParams<CollectionShowMatchParams>) => {
      const { fetchCollectionShowData } = await import('./containers/collectionShow/sideEffect');
      await Promise.all([fetchCollectionShowData(params)]);
    },
  },
  {
    path: JOURNAL_SHOW_PATH,
    component: loadable(() => import('./components/journalShow'), {
      fallback: <LoadingSpinner />,
    }),
    loadData: async (params: LoadDataParams<JournalShowMatchParams>) => {
      const { fetchJournalShowPageData } = await import('./components/journalShow/sideEffect');
      await Promise.all([fetchJournalShowPageData(params)]);
    },
  },
  {
    path: COLLECTION_LIST_PATH,
    component: loadable(() => import('./components/collections'), {
      fallback: <LoadingSpinner />,
    }),
    loadData: async (params: LoadDataParams<{ userId: string }>) => {
      const { getCollections } = await import('./components/collections/sideEffect');
      await Promise.all([getCollections(params)]);
    },
    exact: true,
  },
  {
    path: AUTH_PATH,
    component: loadable(() => import('./components/auth'), {
      fallback: <LoadingSpinner />,
    }),
  },
  {
    path: USER_SETTINGS_PATH,
    component: loadable(() => import('./containers/userSettings'), {
      fallback: <LoadingSpinner />,
    }),
  },
  {
    path: KEYWORD_SETTINGS_PATH,
    component: loadable(() => import('./containers/keywordSettings'), {
      fallback: <LoadingSpinner />,
    }),
  },
  {
    path: DESIGN_PATH,
    component: loadable(() => import('./containers/admin'), {
      fallback: <LoadingSpinner />,
    }),
  },
  {
    path: TERMS_OF_SERVICE_PATH,
    component: loadable(() => import('./components/termsOfService/termsOfService'), {
      fallback: <LoadingSpinner />,
    }),
    exact: true,
  },
  {
    path: PRIVACY_POLICY_PATH,
    component: loadable(() => import('./components/privacyPolicy/privacyPolicy'), {
      fallback: <LoadingSpinner />,
    }),
    exact: true,
  },
  {
    path: '/ui-demo',
    component: loadable(() => import('./components/uiDemo/uiDemo')),
    exact: true,
  },
  {
    path: '/paper-item-demo',
    component: loadable(() => import('./components/common/paperItem/demo'), {
      fallback: <LoadingSpinner />,
    }),
    exact: true,
  },
  { component: ErrorPage },
];

interface RootRoutesProps extends RouteComponentProps<any> {}

const DialogComponent = loadable(() => import('./components/dialog'));
const FeedbackButton = loadable(() => import('./containers/feedbackButton'));
const ImprovedHeader = loadable(() => import('./components/layouts/improvedHeader'));
const SnackbarComponent = loadable(() => import('./components/snackbar'));
const PopupConsentBanner = loadable(() => import('./components/popupConsentBanner'));

const DefaultHelmet = () => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="theme-color" content="#3e7fff" />
      <link rel="shortcut icon" href="https://assets.pluto.network/scinapse/favicon.ico" />
      <link
        rel="search"
        href="https://scinapse.io/opensearch.xml"
        type="application/opensearchdescription+xml"
        title="Scinapse.io"
      />
      <title>Scinapse | Academic search engine for paper</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes" />
      <meta itemProp="name" content="Scinapse | Academic search engine for paper" />
      <meta
        name="description"
        content="Every research begins here. Find papers from over 170m papers in major STEM journals. Save time and never re-search."
      />
      <meta itemProp="image" content="http://assets.pluto.network/og-image.png" />
      <meta name="twitter:title" content="Scinapse | Academic search engine for paper" />
      <meta
        name="twitter:description"
        content="Every research begins here. Find papers from over 170m papers in major STEM journals. Save time and never re-search."
      />
      <meta name="twitter:card" content="Pluto Inc." />
      <meta name="twitter:site" content="@pluto_network" />
      <meta name="twitter:creator" content="@pluto_network" />
      <meta name="twitter:image" content="http://assets.pluto.network/og-image.png" />
      <meta property="og:title" content="Scinapse | Academic search engine for paper" />
      <meta
        property="og:description"
        content="Every research begins here. Find papers from over 170m papers in major STEM journals. Save time and never re-search."
      />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="https://scinapse.io" />
      <meta property="og:image" content="http://assets.pluto.network/og-image.png" />
      <meta property="og:site_name" content="Scinapse" />
      <meta name="google-site-verification" content="YHiVYg7vff8VWXZge2D1aOZsT8rCUxnkjwbQqFT2QEI" />
      <meta name="msvalidate.01" content="55ADC81A3C8F5F3DAA9B90F27CA16E2B" />
      <link rel="manifest" href="/manifest.json" />
      <link
        rel="apple-touch-startup-image"
        href="https://assets.pluto.network/scinapse/app_icon/launch-640x1136.png"
        media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="https://assets.pluto.network/scinapse/app_icon/launch-750x1294.png"
        media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="https://assets.pluto.network/scinapse/app_icon/launch-1242x2148.png"
        media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="https://assets.pluto.network/scinapse/app_icon/launch-1125x2436.png"
        media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="https://assets.pluto.network/scinapse/app_icon/launch-1536x2048.png"
        media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="https://assets.pluto.network/scinapse/app_icon/launch-1668x2224.png"
        media="(min-device-width: 834px) and (max-device-width: 834px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
      />
      <link
        rel="apple-touch-startup-image"
        href="https://assets.pluto.network/scinapse/app_icon/launch-2048x2732.png"
        media="(min-device-width: 1024px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2) and (orientation: portrait)"
      />
    </Helmet>
  );
};

const RootRoutes: React.FC<RootRoutesProps> = props => {
  const { location } = props;
  const isOpenMobileSearchBox = useSelector<AppState, boolean>(state => state.searchQueryState.isOpenMobileBox);

  return (
    <div>
      <DefaultHelmet />
      <ImprovedHeader />
      <div className={classNames({ [styles.mainContentsAtOpenMobileSearchBox]: isOpenMobileSearchBox })}>
        <Switch location={location}>
          {routesMap.map(route => <Route {...route} key={route.path || 'errorPage'} />)}
        </Switch>
      </div>
      <DeviceDetector />
      <LocationListener />
      <DialogComponent />
      <FeedbackButton />
      <SnackbarComponent />
      <PopupConsentBanner />
    </div>
  );
};

export const ConnectedRootRoutes = withRouter(withStyles<typeof RootRoutes>(styles)(RootRoutes));
