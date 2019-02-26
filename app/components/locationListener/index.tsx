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
  AUTHOR_SEARCH_RESULT_PATH,
} from "../../constants/routes";
import getQueryParamsObject from "../../helpers/getQueryParamsObject";

interface LocationListenerProps extends RouteComponentProps<{}> {}
export interface HistoryInformation {
  key: string;
  scrollPosition: number;
}

export const HISTORY_SESSION_KEY = "historyStack";
let DEV_BRANCH_NAME: string = "";
const MAXIMUM_COUNT_TO_SAVE_HISTORY = 100;

export function getCurrentPageType(): Scinapse.ActionTicket.PageType {
  if (!EnvChecker.isOnServer()) {
    const { pathname } = window.location;
    if (pathname === HOME_PATH) {
      return "home";
    } else if (pathname === SEARCH_RESULT_PATH) {
      return "searchResult";
    } else if (pathname === AUTHOR_SEARCH_RESULT_PATH) {
      return "authorSearchResult";
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

  public componentWillReceiveProps(nextProps: LocationListenerProps) {
    const { location } = this.props;

    if (!EnvChecker.isOnServer() && location !== nextProps.location) {
      let historyStack: HistoryInformation[] = JSON.parse(window.sessionStorage.getItem(HISTORY_SESSION_KEY) || "[]");
      const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
      const historyInformation = { key: location.key || "initial", scrollPosition: scrollTop };

      const index = historyStack.findIndex(history => history.key === location.key);
      if (index === -1) {
        historyStack = [historyInformation, ...historyStack];
      } else {
        historyStack = [...historyStack.slice(0, index), historyInformation, ...historyStack.slice(index + 1)];
      }

      if (historyStack.length > MAXIMUM_COUNT_TO_SAVE_HISTORY) {
        historyStack = historyStack.slice(0, MAXIMUM_COUNT_TO_SAVE_HISTORY);
      }

      window.sessionStorage.setItem(HISTORY_SESSION_KEY, JSON.stringify(historyStack));

      const queryObject = getQueryParamsObject(location.search);

      if (DEV_BRANCH_NAME === "") {
        DEV_BRANCH_NAME = queryObject.branch;
      }

      if (queryObject.branch || DEV_BRANCH_NAME !== "") {
        if (nextProps.location.search) {
          history.replaceState(
            null,
            "",
            `${nextProps.location.pathname}${nextProps.location.search}&branch=${DEV_BRANCH_NAME}`
          );
        } else {
          history.replaceState(null, "", `${nextProps.location.pathname}?branch=${DEV_BRANCH_NAME}`);
        }
      }
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
