import * as ReactGA from 'react-ga';
import EnvChecker from './envChecker';
import { DEV_GA_ID, LOCAL_GA_ID, LOCAL_OPTIMIZE_ID, PROD_GA_ID, PROD_OPTIMIZE_ID } from '../constants/ga';
import envChecker from './envChecker';

export function getGAId() {
  if (EnvChecker.isProdBrowser()) {
    return PROD_GA_ID;
  }
  if (EnvChecker.isDev()) {
    return DEV_GA_ID;
  }

  return LOCAL_GA_ID;
}

export function getOptimizeId() {
  if (EnvChecker.isProdBrowser()) {
    return PROD_OPTIMIZE_ID;
  }

  if (envChecker.isLocal()) {
    return LOCAL_OPTIMIZE_ID;
  }
}

export function trackAndOpenLink(from: string) {
  if (EnvChecker.isProdBrowser()) {
    ReactGA.outboundLink(
      {
        label: from,
      },
      () => {}
    );
  }
}

export function trackEvent(params: ReactGA.EventArgs) {
  if (!EnvChecker.isOnServer() && EnvChecker.isProdBrowser()) {
    ReactGA.event(params);
  }
}

export function trackDialogView(name: string) {
  if (EnvChecker.isProdBrowser()) {
    ReactGA.modalview(name);
  }
}
