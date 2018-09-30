import * as React from "react";
import EnvChecker from "./envChecker";

export function logException(error: Error, errorInfo?: any) {
  if (EnvChecker.isLocal()) {
    console.error("Error!", error, errorInfo);
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
