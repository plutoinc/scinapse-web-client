import * as ReactGA from "react-ga";

export function trackAndOpenLink(from: string) {
  ReactGA.outboundLink(
    {
      label: from,
    },
    () => {}
  );
}

export function trackEvent(params: ReactGA.EventArgs) {
  ReactGA.event(params);
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

export function measureTiming(category: string, variable: string, consumedTime: number) {
  ReactGA.timing({
    category,
    variable,
    value: consumedTime,
  });
}
