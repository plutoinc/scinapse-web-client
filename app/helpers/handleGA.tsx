import * as ReactGA from "react-ga";

export function trackAndOpenLink(url: string, from: string) {
  ReactGA.event({
    category: "link-click",
    action: `click-from-${from}`,
    label: url,
  });
  window.open(url, "_blank");
}

export function trackAction(path: string, from: string) {
  ReactGA.event({
    category: "link-click",
    action: `click-from-${from}`,
    label: path,
  });
}
