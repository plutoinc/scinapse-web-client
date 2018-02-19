import * as React from "react";
import { Route, Switch, RouteProps } from "react-router-dom";
import { Store, connect, DispatchProp } from "react-redux";
import { Header, FeedbackButton, MobileHeader } from "./components/layouts";
import Home from "./components/home";
import ArticleSearch from "./components/articleSearch";
import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";
import ErrorPage from "./components/error/errorPage";
import LocationListener from "./components/locationListener";
import DeviceDetector from "./components/deviceDetector";
import { IAppState } from "./reducers";
import { ILayoutStateRecord } from "./components/layouts/records";
import "normalize.css";
import "./root.scss";

export const HOME_PATH = "/";
export const SEARCH_RESULT_PATH = "/search";
export const USER_AUTH_PATH = "/users";
export const ERROR_PATH = "/:errorNum";

interface ServerRoutesMap {
  path: string;
  component: any;
  exact?: boolean;
  loadData: (store: Store<IAppState>, params: any) => Promise<any> | null;
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
    loadData: null,
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
  layout: ILayoutStateRecord;
  routing: RouteProps;
}

interface RootRoutesProps extends DispatchProp<RootRoutesMappedStates> {
  layout: ILayoutStateRecord;
  routing: RouteProps;
}

function mapStateToProps(state: IAppState) {
  return {
    layout: state.layout,
    routing: state.routing,
  };
}

class RootRoutes extends React.PureComponent<RootRoutesProps, {}> {
  public render() {
    const { routing } = this.props;

    return (
      <div>
        {this.getHeader()}
        <Switch location={routing.location}>
          {routesMap.map(route => <Route {...route} key={routing.location.pathname} />)}
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
