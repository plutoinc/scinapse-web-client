import * as Raven from "raven-js";

export function logException(ex: Error, context?: any) {
  Raven.captureException(ex, {
    extra: context,
  });

  window.console && console.error && console.error(ex);
}
