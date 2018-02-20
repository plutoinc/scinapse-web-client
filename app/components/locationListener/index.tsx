import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as ReactGA from "react-ga";
import EnvChecker from "../../helpers/envChecker";

interface LocationListenerProps extends RouteComponentProps<{}> {}

class LocationListener extends React.PureComponent<LocationListenerProps, {}> {
  public componentDidUpdate(prevProps: LocationListenerProps) {
    if (!EnvChecker.isServer() && this.props.location !== prevProps.location && !EnvChecker.isDev()) {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  public render() {
    return <span />;
  }
}

export default withRouter(LocationListener);
