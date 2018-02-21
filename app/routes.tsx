import * as React from "react";
import { Route, Switch, RouteProps, match } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Store, connect, DispatchProp } from "react-redux";
import { Header, FeedbackButton, MobileHeader } from "./components/layouts";
import Home from "./components/home";
import ArticleSearch, { getSearchData } from "./components/articleSearch";
import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";
import ErrorPage from "./components/error/errorPage";
import LocationListener from "./components/locationListener";
import DeviceDetector from "./components/deviceDetector";
import { AppState } from "./reducers";
import { LayoutStateRecord } from "./components/layouts/records";
import { withStyles } from "./helpers/withStylesHelper";
const styles = require("./root.scss");

export const HOME_PATH = "/";
export const SEARCH_RESULT_PATH = "/search";
export const USER_AUTH_PATH = "/users";
export const ERROR_PATH = "/:errorNum";

export interface LoadDataParams {
  store: Store<AppState>;
  match: match<any>;
  queryParams?: object;
}

interface ServerRoutesMap {
  path: string;
  component: React.ComponentClass;
  exact?: boolean;
  loadData: (params: LoadDataParams) => Promise<any> | null;
}

export const routesMap: ServerRoutesMap[] = [
  {
    path: HOME_PATH,
    component: Home,
    loadData: null,
    exact: true,
  },
  {
    path: SEARCH_RESULT_PATH,
    component: ArticleSearch,
    loadData: async (params: LoadDataParams) => {
      await getSearchData(params);
    },
  },
  {
    path: USER_AUTH_PATH,
    component: AuthComponent,
    loadData: null,
  },
  {
    path: ERROR_PATH,
    component: ErrorPage,
    loadData: null,
  },
];

interface RootRoutesMappedStates {
  layout: LayoutStateRecord;
  routing: RouteProps;
}

interface RootRoutesProps extends DispatchProp<RootRoutesMappedStates> {
  layout: LayoutStateRecord;
  routing: RouteProps;
}

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    routing: state.routing,
  };
}

@withStyles<typeof RootRoutes>(styles)
class RootRoutes extends React.PureComponent<RootRoutesProps, {}> {
  public render() {
    const { routing } = this.props;

    return (
      <div>
        {this.getDefaultHelmet()}
        {this.getHeader()}
        <Switch location={routing.location}>
          {routesMap.map((route, index) => (
            <Route {...route} key={routing.location ? routing.location.pathname : `route_path_${index}`} />
          ))}
        </Switch>
        <DeviceDetector />
        <LocationListener />
        <DialogComponent />
        <FeedbackButton />
      </div>
    );
  }

  private getDefaultHelmet = () => {
    return (
      <Helmet>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="https://dd2gn9pwu61vr.cloudfront.net/favicon.ico" />
        <title>Pluto Beta | Academic discovery</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <meta
          name="description"
          content="Pluto's beta service is an search engine for academic articles. Quickly skim through intuitive search feeds, and immediately find articles of your interest. Give more power to Pluto search service by putting your own reviews on research articles. Sign up to Pluto simply with your Facebook, Google, ORCID, or Email accounts, and enjoy the full features of Pluto."
        />

        <meta itemProp="name" content="Pluto Beta | Academic discovery" />
        <meta
          itemProp="description"
          content="Pluto's beta service is an search engine for academic articles. Quickly skim through intuitive search feeds, and immediately find articles of your interest. Give more power to Pluto search service by putting your own reviews on research articles. Sign up to Pluto simply with your Facebook, Google, ORCID, or Email accounts, and enjoy the full features of Pluto."
        />
        <meta itemProp="image" content="http://assets.pluto.network/meta-img-search.jpg" />

        <meta name="twitter:card" content="Pluto Network" />
        <meta name="twitter:site" content="@pluto_network" />
        <meta name="twitter:title" content="Pluto Beta | Academic discovery" />
        <meta
          name="twitter:description"
          content="Pluto's beta service is an search engine for academic articles. Quickly skim through intuitive search feeds, and immediately find articles of your interest. Give more power to Pluto search service by putting your own reviews on research articles. Sign up to Pluto simply with your Facebook, Google, ORCID, or Email accounts, and enjoy the full features of Pluto."
        />
        <meta name="twitter:creator" content="@pluto_network" />
        <meta name="twitter:image" content="http://assets.pluto.network/meta-img-search.jpg" />

        <meta property="og:title" content="Pluto Beta | Academic discovery" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://search.pluto.network" />
        <meta property="og:image" content="http://assets.pluto.network/meta-img-search.jpg" />
        <meta
          property="og:description"
          content="Pluto's beta service is an search engine for academic articles. Quickly skim through intuitive search feeds, and immediately find articles of your interest. Give more power to Pluto search service by putting your own reviews on research articles. Sign up to Pluto simply with your Facebook, Google, ORCID, or Email accounts, and enjoy the full features of Pluto."
        />
        <meta property="og:site_name" content="Pluto Beta" />
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

export const ConnectedRootRoutes = connect(mapStateToProps)(RootRoutes);
