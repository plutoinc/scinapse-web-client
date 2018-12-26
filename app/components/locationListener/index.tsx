import * as React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import * as ReactGA from "react-ga";
import EnvChecker from "../../helpers/envChecker";
import ActionTicketManager from "../../helpers/actionTicketManager";

interface LocationListenerProps extends RouteComponentProps<{}> {}

class LocationListener extends React.PureComponent<LocationListenerProps, {}> {
  public componentDidMount() {
    if (!EnvChecker.isOnServer()) {
      ActionTicketManager.trackTicket({
        pageUrl: window.location.href,
        // TODO: Change below following the mapper
        pageType: "author_show",
        actionTarget: null,
        actionType: "view",
        actionArea: null,
        actionTag: "page_view",
        actionLabel: null,
      });
    }
  }

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
