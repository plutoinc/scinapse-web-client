import * as React from "react";
import EnvChecker from "./envChecker";

export function logException(ex: Error, context?: any) {
  if (EnvChecker.isLocal()) {
    console.error("Error!", ex, context);
  }
}

export default class ErrorTracker extends React.PureComponent<{}, {}> {
  public componentDidCatch(error: Error, info: any) {
    logException(error, info);
  }

  public render() {
    return <div>{this.props.children}</div>;
  }
}
