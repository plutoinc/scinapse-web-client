import * as ReactGA from "react-ga";
import EnvChecker from "./envChecker";

export function trackAndOpenLink(from: string) {
  ReactGA.outboundLink(
    {
      label: from,
    },
    () => {}
  );
}

export function trackEvent(params: ReactGA.EventArgs) {
  if (!EnvChecker.isOnServer()) {
    ReactGA.event(params);
  }
}

/* will be deprecated */
export function trackAction(path: string, from: string) {
  ReactGA.event({
    category: "link-click",
    action: `click-from-${from}`,
    label: path,
  });
}

export function trackDialogView(name: string) {
  ReactGA.modalview(name);
}
