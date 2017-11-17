import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as ReactGA from "react-ga";
import EnvChecker from "../../helpers/envChecker";

interface ILocationListenerProps extends RouteComponentProps<{}> {}

class LocationListener extends React.PureComponent<ILocationListenerProps, {}> {
  public componentDidUpdate(prevProps: ILocationListenerProps) {
    if (this.props.location !== prevProps.location && !EnvChecker.isDev()) {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  public render() {
    return <span />;
  }
}

export default (withRouter as any)(LocationListener);
