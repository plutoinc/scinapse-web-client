import * as React from "react";
import EnvChecker from "./envChecker";

declare var trackJs: any;

export function logException(error: Error, errorInfo?: any) {
  if (EnvChecker.isLocal()) {
    console.error("Error!", error, errorInfo);
  } else if (EnvChecker.isProdBrowser()) {
    if (errorInfo && errorInfo.componentStack) {
      // The component stack is sometimes useful in development mode
      // In production it can be somewhat obfuscated, so feel free to omit this line.
      console.log(errorInfo.componentStack);
    }

    // TrackJS should be configured and available before making this call
    // Either as an imported module or a global (ESLint global ignore is used above)
    trackJs.track(error);

    this.setState({ error });
  }
}

export default class ErrorTracker extends React.PureComponent<{}, {}> {
  public componentDidCatch(error: Error, errorInfo: any) {
    logException(error, errorInfo);
  }

  public render() {
    return <div>{this.props.children}</div>;
  }
}
