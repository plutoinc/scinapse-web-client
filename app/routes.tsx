import * as React from "react";
import loadable from "@loadable/component";
import { Route, Switch, match, withRouter, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect, Dispatch } from "react-redux";
import axios, { CancelToken } from "axios";
import { PaperShowMatchParams } from "./containers/paperShow/types";
import { AuthorShowMatchParams } from "./containers/authorShow/types";
import { JournalShowMatchParams } from "./components/journalShow/types";
import { CollectionShowMatchParams } from "./components/collectionShow/types";
import { fetchPaperShowData } from "./containers/paperShow/sideEffect";
import ErrorPage from "./components/error/errorPage";
import LocationListener from "./components/locationListener";
import DeviceDetector from "./components/deviceDetector";
import { AppState } from "./reducers";
import { LayoutState } from "./components/layouts/records";
import { withStyles } from "./helpers/withStylesHelper";
import { getSearchData } from "./components/articleSearch/sideEffect";
import { fetchAuthorShowPageData } from "./containers/authorShow/sideEffect";
import ArticleSpinner from "./components/common/spinner/articleSpinner";
import { fetchCollectionShowData } from "./components/collectionShow/sideEffect";
import { fetchJournalShowPageData } from "./components/journalShow/sideEffect";
import { CurrentUser } from "./model/currentUser";
import { Configuration } from "./reducers/configuration";
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
  ADMIN_PATH,
  TERMS_OF_SERVICE_PATH,
} from "./constants/routes";
import { getAuthorSearchData } from "./containers/authorSearch/sideEffect";
import { checkAuthStatus } from "./components/auth/actions";
import { getCollections as sideEffectGetCollections } from "./components/collections/sideEffect";
import { getCollections } from "./components/collections/actions";
const styles = require("./root.scss");

export interface LoadDataParams<P> {
  dispatch: Dispatch<any>;
  match: match<P>;
  pathname: string;
  queryParams?: any;
  cancelToken: CancelToken;
}

interface ServerRoutesMap {
  path?: string;
  component?: any;
  exact?: boolean;
  loadData?: (params: LoadDataParams<any>) => Promise<any>;
  render?: any;
}

export const routesMap: ServerRoutesMap[] = [
  {
    path: HOME_PATH,
    exact: true,
    component: loadable(() => import(/* webpackPrefetch: true */ "./components/home"), {
      fallback: <div>loading ...</div>,
    }),
  },
  {
    path: SEARCH_RESULT_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./components/articleSearch"), {
      fallback: <div>loading ...</div>,
    }),
    loadData: async (params: LoadDataParams<null>) => {
      await Promise.all([getSearchData(params)]);
    },
    exact: true,
  },
  {
    path: AUTHOR_SEARCH_RESULT_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./containers/authorSearch"), {
      fallback: <div>loading ...</div>,
    }),
    loadData: async (params: LoadDataParams<null>) => {
      await Promise.all([getAuthorSearchData(params)]);
    },
    exact: true,
  },
  {
    path: PAPER_SHOW_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./containers/paperShow"), {
      fallback: <div>loading ...</div>,
    }),
    loadData: async (params: LoadDataParams<PaperShowMatchParams>) => {
      await Promise.all([fetchPaperShowData(params)]);
    },
  },
  {
    path: AUTHOR_SHOW_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./containers/authorShow"), {
      fallback: <div>loading ...</div>,
    }),
    loadData: async (params: LoadDataParams<AuthorShowMatchParams>) => {
      await Promise.all([fetchAuthorShowPageData(params)]);
    },
  },
  {
    path: COLLECTION_SHOW_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./components/collectionShow"), {
      fallback: <div>loading ...</div>,
    }),
    loadData: async (params: LoadDataParams<CollectionShowMatchParams>) => {
      await Promise.all([fetchCollectionShowData(params)]);
    },
  },
  {
    path: JOURNAL_SHOW_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./components/journalShow"), {
      fallback: <div>loading ...</div>,
    }),
    loadData: async (params: LoadDataParams<JournalShowMatchParams>) => {
      await Promise.all([fetchJournalShowPageData(params)]);
    },
  },
  {
    path: COLLECTION_LIST_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./components/collections"), {
      fallback: <div>loading ...</div>,
    }),
    loadData: async (params: LoadDataParams<{ userId: string }>) => {
      await Promise.all([sideEffectGetCollections(params)]);
    },
    exact: true,
  },
  {
    path: AUTH_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./components/auth"), {
      fallback: <div>loading ...</div>,
    }),
  },
  {
    path: ADMIN_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./containers/admin"), {
      fallback: <div>loading ...</div>,
    }),
  },
  {
    path: TERMS_OF_SERVICE_PATH,
    component: loadable(() => import(/* webpackPrefetch: true */ "./components/termsOfService/termsOfService"), {
      fallback: <div>loading ...</div>,
    }),
    exact: true,
  },
  {
    component: ErrorPage,
  },
];

interface RootRoutesProps extends RouteComponentProps<any> {
  layout: LayoutState;
  configuration: Configuration;
  currentUser: CurrentUser;
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    configuration: state.configuration,
    currentUser: state.currentUser,
  };
}

const DialogComponent = loadable(() => import("./components/dialog"));
const FeedbackButton = loadable(() => import("./containers/feedbackButton"));
const Header = loadable(() => import("./components/layouts/header"));

@withStyles<typeof RootRoutes>(styles)
class RootRoutes extends React.PureComponent<RootRoutesProps> {
  private cancelToken = axios.CancelToken.source();
  public componentDidMount = async () => {
    const { dispatch } = this.props;
    const user = await dispatch(checkAuthStatus());

    if (user && user.member) {
      dispatch(getCollections(user.member.id, this.cancelToken.token, true));
    }
  };

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { location } = this.props;

    return (
      <div>
        {this.getDefaultHelmet()}
        <Header />
        {this.getLoadingComponent()}
        <div>
          <Switch location={location}>
            {routesMap.map(route => <Route {...route} key={route.path || "errorPage"} />)}
          </Switch>
        </div>
        <DeviceDetector />
        <LocationListener />
        <DialogComponent />
        <FeedbackButton />
      </div>
    );
  }

  private getLoadingComponent = () => {
    const { configuration } = this.props;

    if (!configuration.renderedAtClient) {
      return (
        <div className={styles.jsLoaderWrapper}>
          <div className={styles.loadingContentWrapper}>
            <ArticleSpinner className={styles.loadingIcon} />
            <div className={styles.loadingMessage}>Loading Scinapse...</div>
          </div>
        </div>
      );
    }

    return null;
  };

  private getDefaultHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://assets.pluto.network/scinapse/favicon.ico" />
        <link
          rel="search"
          href="https://scinapse.io/opensearch.xml"
          type="application/opensearchdescription+xml"
          title="Scinapse.io"
        />
        <title>Scinapse | Academic search engine for paper</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta itemProp="name" content="sci-napse | Academic search engine for paper" />
        <meta
          name="description"
          // tslint:disable-next-line:max-line-length
          content="sci-napse is the fastest search engine for scientific papers. sci-napse covers over 170m+ papers and 48k+ journals. Just try sci-napse, you can quickly find the scientific paper exactly you want."
        />
        <meta
          name="twitter:description"
          // tslint:disable-next-line:max-line-length
          content="sci-napse is the fastest search engine for scientific papers. sci-napse covers over 170m+ papers and 48k+ journals. Just try sci-napse, you can quickly find the scientific paper exactly you want."
        />
        <meta itemProp="image" content="http://assets.pluto.network/og-image.png" />
        <meta name="twitter:card" content="Pluto Network" />
        <meta name="twitter:site" content="@pluto_network" />
        <meta name="twitter:title" content="Scinapse | Academic search engine for paper" />
        <meta name="twitter:creator" content="@pluto_network" />
        <meta name="twitter:image" content="http://assets.pluto.network/og-image.png" />
        <meta property="og:title" content="Scinapse | Academic search engine for paper" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://scinapse.io" />
        <meta property="og:image" content="http://assets.pluto.network/og-image.png" />
        <meta
          property="og:description"
          // tslint:disable-next-line:max-line-length
          content="sci-napse is the fastest search engine for scientific papers. sci-napse covers over 170m+ papers and 48k+ journals. Just try sci-napse, you can quickly find the scientific paper exactly you want."
        />
        <meta property="og:site_name" content="Scinapse" />
        <meta name="google-site-verification" content="YHiVYg7vff8VWXZge2D1aOZsT8rCUxnkjwbQqFT2QEI" />
        <meta name="msvalidate.01" content="55ADC81A3C8F5F3DAA9B90F27CA16E2B" />
      </Helmet>
    );
  };
}

export const ConnectedRootRoutes = withRouter(connect(mapStateToProps)(RootRoutes));
