import * as ReactGA from "react-ga";

export function trackAndOpenLink(from: string) {
  ReactGA.outboundLink(
    {
      label: from,
    },
    () => {},
  );
}

export function trackAction(path: string, from: string) {
  ReactGA.event({
    category: "link-click",
    action: `click-from-${from}`,
    label: path,
  });
}

export function trackSearch(action: string, label: string) {
  ReactGA.event({
    category: "search",
    action,
    label,
  });
}

export function measureTiming(category: string, variable: string, consumedTime: number) {
  ReactGA.timing({
    category,
    variable,
    value: consumedTime,
  });
}
