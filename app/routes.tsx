import * as React from "react";
import { Route, Switch, RouteProps, match } from "react-router-dom";
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
