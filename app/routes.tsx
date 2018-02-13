import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { connect, DispatchProp } from "react-redux";
import { Header, Footer, FeedbackButton, MobileHeader } from "./components/layouts";
import Home from "./components/home";
import ArticleSearch from "./components/articleSearch";
import AuthComponent from "./components/auth";
import DialogComponent from "./components/dialog";
import ErrorPage from "./components/error/errorPage";
import LocationListener from "./components/locationListener";
import DeviceDetector from "./components/deviceDetector";
import { IAppState } from "./reducers";
import { ILayoutStateRecord } from "./components/layouts/records";
import { RouteProps } from "react-router";
import "normalize.css";
import "./root.scss";

function mapStateToProps(state: IAppState) {
  return {
    layout: state.layout,
    routing: state.routing,
  };
}

interface IRootRoutesMappedStates {
  layout: ILayoutStateRecord;
  routing: RouteProps;
}

interface IRootRoutes extends DispatchProp<IRootRoutesMappedStates> {
  layout: ILayoutStateRecord;
  routing: RouteProps;
}

class RootRoutes extends React.PureComponent<IRootRoutes, {}> {
  private getHeader = () => {
    const { layout } = this.props;

    if (layout.isMobile) {
      return <MobileHeader />;
    } else {
      return <Header />;
    }
  };

  public render() {
    return (
      <div>
        {this.getHeader()}
        <DeviceDetector />
        <LocationListener />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/search" component={ArticleSearch} />
          <Route path="/users" component={AuthComponent} />
          <Route path="/:errorNum" component={ErrorPage} />
        </Switch>
        <DialogComponent />
        <Footer />
        <FeedbackButton />
      </div>
    );
  }
}

export default connect(mapStateToProps)(RootRoutes);
