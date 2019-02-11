import * as ReactGA from "react-ga";
import EnvChecker from "./envChecker";

export function trackAndOpenLink(from: string) {
  if (EnvChecker.isProdBrowser()) {
    ReactGA.outboundLink(
      {
        label: from,
      },
      () => {}
    );
  }
}

export function trackEvent(params: ReactGA.EventArgs) {
  if (!EnvChecker.isOnServer() && EnvChecker.isProdBrowser()) {
    ReactGA.event(params);
  }
}

/* will be deprecated */
export function trackAction(path: string, from: string) {
  if (EnvChecker.isProdBrowser()) {
    ReactGA.event({
      category: "link-click",
      action: `click-from-${from}`,
      label: path,
    });
  }
}

export function trackDialogView(name: string) {
  if (EnvChecker.isProdBrowser()) {
    ReactGA.modalview(name);
  }
}
