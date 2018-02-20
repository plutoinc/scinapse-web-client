import * as React from "react";
import * as Raven from "raven-js";
import EnvChecker from "./envChecker";

function logException(ex: Error, context?: any) {
  if (!EnvChecker.isDev() && !EnvChecker.isStage()) {
    Raven.captureException(ex, {
      extra: context,
    });
  }

  if (EnvChecker.isDev()) {
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
