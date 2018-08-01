import * as React from "react";
import { Route, Switch, match, withRouter, RouteComponentProps } from "react-router-dom";
import { Helmet } from "react-helmet";
import { connect, Dispatch } from "react-redux";
import { Header, FeedbackButton, MobileHeader } from "./components/layouts";
import Home from "./components/home";
import ArticleSearch from "./components/articleSearch";
import AuthComponent from "./components/auth";
import PaperShow, { PaperShowMatchParams } from "./components/paperShow";
import AuthorShow, { AuthorShowMatchParams } from "./components/authorShow";
import CollectionShow, { CollectionShowMatchParams } from "./components/collectionShow";
import { fetchPaperShowData } from "./components/paperShow/sideEffect";
import DialogComponent from "./components/dialog";
import ErrorPage from "./components/error/errorPage";
import TermsOfService from "./components/termsOfService/termsOfService";
import LocationListener from "./components/locationListener";
import DeviceDetector from "./components/deviceDetector";
import UserCollections from "./components/collections";
import { AppState } from "./reducers";
import { LayoutState } from "./components/layouts/records";
import { withStyles } from "./helpers/withStylesHelper";
import { getSearchData } from "./components/articleSearch/sideEffect";
import { fetchAuthorShowPageData } from "./components/authorShow/sideEffect";
import { Configuration } from "./reducers/configuration";
import ArticleSpinner from "./components/common/spinner/articleSpinner";
import { fetchCollectionShowData } from "./components/collectionShow/sideEffect";
const styles = require("./root.scss");

export const HOME_PATH = "/";
export const SEARCH_RESULT_PATH = "/search";
export const AUTHOR_SHOW_PATH = "/authors/:authorId";
export const USER_COLLECTIONS_PATH = "/users/:userId/collections";
export const AUTH_PATH = "/users";
export const PAPER_SHOW_PATH = "/papers/:paperId";
export const COLLECTION_SHOW_PATH = "/collections/:collectionId";
export const ERROR_PATH = "/:errorNum";
export const TERMS_OF_SERVICE_PATH = "/terms-of-service";

export interface LoadDataParams<P> {
  dispatch: Dispatch<any>;
  match: match<P>;
  pathname: string;
  queryParams?: any;
}

interface ServerRoutesMap {
  path: string;
  component: React.ComponentClass;
  exact?: boolean;
  loadData?: (params: LoadDataParams<any>) => Promise<any>;
}

export const routesMap: ServerRoutesMap[] = [
  {
    path: HOME_PATH,
    component: Home,
    exact: true,
  },
  {
    path: SEARCH_RESULT_PATH,
    component: ArticleSearch,
    loadData: async (params: LoadDataParams<null>) => {
      await Promise.all([getSearchData(params)]);
    },
    exact: true,
  },
  {
    path: PAPER_SHOW_PATH,
    component: PaperShow,
    loadData: async (params: LoadDataParams<PaperShowMatchParams>) => {
      await Promise.all([fetchPaperShowData(params)]);
    },
  },
  {
    path: AUTHOR_SHOW_PATH,
    component: AuthorShow,
    loadData: async (params: LoadDataParams<AuthorShowMatchParams>) => {
      await Promise.all([fetchAuthorShowPageData(params)]);
    },
  },
  {
    path: COLLECTION_SHOW_PATH,
    component: CollectionShow,
    loadData: async (params: LoadDataParams<CollectionShowMatchParams>) => {
      await Promise.all([fetchCollectionShowData(params)]);
    },
  },
  {
    path: USER_COLLECTIONS_PATH,
    component: UserCollections,
    exact: true,
  },
  {
    path: AUTH_PATH,
    component: AuthComponent,
  },
  {
    path: TERMS_OF_SERVICE_PATH,
    component: TermsOfService,
    exact: true,
  },
  {
    path: ERROR_PATH,
    component: ErrorPage,
  },
];

interface RootRoutesProps extends RouteComponentProps<any> {
  layout: LayoutState;
  configuration: Configuration;
  dispatch: Dispatch<any>;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    configuration: state.configuration,
  };
}

@withStyles<typeof RootRoutes>(styles)
class RootRoutes extends React.PureComponent<RootRoutesProps, {}> {
  public render() {
    const { location } = this.props;

    return (
      <div>
        {this.getDefaultHelmet()}
        {this.getHeader()}
        {this.getLoadingComponent()}
        <div>
          <Switch location={location}>
            {routesMap.map((route, index) => <Route {...route} key={`route_path_${index}`} />)}
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

    if (!configuration.clientJSRendered) {
      return (
        <div className={styles.jsLoaderWrapper}>
          <ArticleSpinner className={styles.loadingIcon} />
          <div className={styles.loadingMessage}>Loading Scinapse...</div>
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
        <title>Sci-napse | Academic search engine for paper</title>
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
        <meta name="twitter:title" content="sci-napse | Academic search engine for paper" />
        <meta name="twitter:creator" content="@pluto_network" />
        <meta name="twitter:image" content="http://assets.pluto.network/og-image.png" />
        <meta property="og:title" content="sci-napse | Academic search engine for paper" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://scinapse.io" />
        <meta property="og:image" content="http://assets.pluto.network/og-image.png" />
        <meta
          property="og:description"
          // tslint:disable-next-line:max-line-length
          content="sci-napse is the fastest search engine for scientific papers. sci-napse covers over 170m+ papers and 48k+ journals. Just try sci-napse, you can quickly find the scientific paper exactly you want."
        />
        <meta property="og:site_name" content="Scinapse" />
        <meta name="msvalidate.01" content="55ADC81A3C8F5F3DAA9B90F27CA16E2B" />
      </Helmet>
    );
  };

  private getHeader = () => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return <MobileHeader />;
    } else {
      return <Header />;
    }
  };
}

export const ConnectedRootRoutes = withRouter(connect(mapStateToProps)(RootRoutes));
