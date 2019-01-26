import * as React from "react";
import * as ReactGA from "react-ga";
import { withRouter, RouteComponentProps } from "react-router-dom";
import EnvChecker from "../../helpers/envChecker";
import ActionTicketManager from "../../helpers/actionTicketManager";
import {
  SEARCH_RESULT_PATH,
  HOME_PATH,
  TERMS_OF_SERVICE_PATH,
  PAPER_SHOW_PATH,
  COLLECTION_SHOW_PATH,
  JOURNAL_SHOW_PATH,
  AUTHOR_SHOW_PATH,
  COLLECTION_LIST_PATH,
  AUTH_PATH,
} from "../../constants/routes";

interface LocationListenerProps extends RouteComponentProps<{}> {}

export function getCurrentPageType(): Scinapse.ActionTicket.PageType {
  if (!EnvChecker.isOnServer()) {
    const { pathname } = window.location;
    if (pathname === HOME_PATH) {
      return "home";
    } else if (pathname === SEARCH_RESULT_PATH) {
      return "searchResult";
    } else if (pathname === TERMS_OF_SERVICE_PATH) {
      return "terms";
    } else if (pathname.startsWith(`/${PAPER_SHOW_PATH.split("/")[1]}`)) {
      return "paperShow";
    } else if (pathname.startsWith(`/${COLLECTION_SHOW_PATH.split("/")[1]}`)) {
      return "collectionShow";
    } else if (pathname.startsWith(`/${JOURNAL_SHOW_PATH.split("/")[1]}`)) {
      return "journalShow";
    } else if (pathname.startsWith(`/${AUTHOR_SHOW_PATH.split("/")[1]}`)) {
      return "authorShow";
    } else if (
      pathname.startsWith(`/${COLLECTION_LIST_PATH.split("/")[1]}`) &&
      pathname.endsWith(COLLECTION_LIST_PATH.split("/")[3])
    ) {
      return "collectionList";
    } else if (pathname.startsWith(AUTH_PATH) && pathname.endsWith("sign_in")) {
      return "signIn";
    } else if (pathname.startsWith(AUTH_PATH) && pathname.endsWith("sign_up")) {
      return "signUp";
    } else if (pathname.startsWith(AUTH_PATH) && pathname.endsWith("reset-password")) {
      return "resetPassword";
    } else if (pathname.startsWith(AUTH_PATH) && pathname.endsWith("email_verification")) {
      return "emailVerification";
    }

    return "unknown";
  }

  return "unknown";
}

class LocationListener extends React.PureComponent<LocationListenerProps> {
  public componentDidMount() {
    if (EnvChecker.isProdBrowser()) {
      this.trackPageView();
    }
  }

  public componentDidUpdate(prevProps: LocationListenerProps) {
    if (!EnvChecker.isOnServer() && this.props.location !== prevProps.location && EnvChecker.isProdBrowser()) {
      this.trackPageView();
      ReactGA.pageview(window.location.pathname + window.location.search);
    }
  }

  public render() {
    return null;
  }

  private trackPageView() {
    if (!EnvChecker.isOnServer()) {
      const urlArray = window.location.pathname.split("/");
      const id = parseInt(urlArray[urlArray.length - 1], 10);

      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: "view",
        actionArea: null,
        actionTag: "pageView",
        actionLabel: !isNaN(id) ? id : null,
      });
    }
  }
}

export default withRouter(LocationListener);
