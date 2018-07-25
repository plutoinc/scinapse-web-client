import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as ReactGA from "react-ga";
import EnvChecker from "../../helpers/envChecker";

interface LocationListenerProps extends RouteComponentProps<{}> {}

class LocationListener extends React.PureComponent<LocationListenerProps, {}> {
  public componentDidUpdate(prevProps: LocationListenerProps) {
    if (!EnvChecker.isOnServer() && this.props.location !== prevProps.location && !EnvChecker.isLocal()) {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  public render() {
    return <span />;
  }
}

export default withRouter(LocationListener);
