import * as React from "react";
import { Route, Switch, RouteProps } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
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
          <Route exact path={HOME_PATH} component={Home} />
          <Route path={SEARCH_RESULT_PATH} component={ArticleSearch} />
          <Route path="/users" component={AuthComponent} />
          <Route path="/:errorNum" component={ErrorPage} />
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

export default connect(mapStateToProps)(RootRoutes);
