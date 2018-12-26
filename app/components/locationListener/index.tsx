import * as React from "react";
import * as ReactGA from "react-ga";
import { withRouter, RouteComponentProps } from "react-router-dom";
import EnvChecker from "../../helpers/envChecker";
import ActionTicketManager from "../../helpers/actionTicketManager";

interface LocationListenerProps extends RouteComponentProps<{}> {}

class LocationListener extends React.PureComponent<LocationListenerProps> {
  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      ActionTicketManager.trackTicket({
        pageUrl: window.location.href,
        actionTarget: null,
        actionType: "view",
        actionArea: null,
        actionTag: "page_view",
        actionLabel: null,
      });
    }
  }

  public componentDidUpdate(prevProps: LocationListenerProps) {
    // if (!EnvChecker.isOnServer() && this.props.location !== prevProps.location && !EnvChecker.isLocal()) {
    if (!EnvChecker.isOnServer() && this.props.location !== prevProps.location) {
      // ReactGA.pageview(window.location.pathname + window.location.search);
      ActionTicketManager.trackTicket({
        pageUrl: window.location.href,
        actionTarget: null,
        actionType: "view",
        actionArea: null,
        actionTag: "page_view",
        actionLabel: null,
      });
    }
  }

  public render() {
    return null;
  }
}

export default withRouter(LocationListener);
