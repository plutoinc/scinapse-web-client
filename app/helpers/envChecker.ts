const isBot = require('isbot');

const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
const DEV_SERVER_HOST_NAME = 'dev.scinapse.io';

export default class EnvChecker {
  public static isLocal(): boolean {
    return (
      !EnvChecker.isOnServer() &&
      !!window.location.hostname &&
      (window.location.hostname.includes('localhost') ||
        window.location.hostname.includes('lvh.me') ||
        IP_REGEX.test(window.location.hostname))
    );
  }

  public static isDev(): boolean {
    return (
      (!EnvChecker.isOnServer() && window.location.hostname && window.location.hostname === DEV_SERVER_HOST_NAME) ||
      (EnvChecker.isOnServer() && process.env.NODE_ENV === 'dev')
    );
  }

  public static isProdBrowser(): boolean {
    return !EnvChecker.isOnServer() && window.location.hostname === 'scinapse.io';
  }

  public static isOnServer(): boolean {
    return typeof window === 'undefined';
  }

  public static isLocalServer(): boolean {
    return EnvChecker.isOnServer() && process.env.NODE_ENV === 'development';
  }

  public static isBot(): boolean {
    if (!EnvChecker.isOnServer()) {
      const userAgent = navigator.userAgent;
      return isBot(userAgent);
    } else {
      return false;
    }
  }
}
