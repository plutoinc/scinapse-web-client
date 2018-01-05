import * as ReactGA from "react-ga";

export function trackAndOpenLink(url: string, from: string) {
  ReactGA.outboundLink(
    {
      label: from,
    },
    () => {},
  );
  window.open(url, "_blank");
}

export function trackAction(path: string, from: string) {
  ReactGA.event({
    category: "link-click",
    action: `click-from-${from}`,
    label: path,
  });
}

export function measureTiming(category: string, variable: string, consumedTime: number) {
  ReactGA.timing({
    category,
    variable,
    value: consumedTime,
  });
}
