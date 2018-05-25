const isBot = require("isbot");

const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
const STAGE_SERVER_HOST_NAME = "stage.scinapse.io";

export default class EnvChecker {
  public static isDev(): boolean {
    return (
      !EnvChecker.isServer() &&
      !!window.location.hostname &&
      (window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("lvh.me") ||
        IP_REGEX.test(window.location.hostname))
    );
  }

  public static isStage(): boolean {
    return (
      (!EnvChecker.isServer() &&
        window.location.hostname &&
        window.location.hostname.includes(STAGE_SERVER_HOST_NAME)) ||
      (EnvChecker.isServer() && process.env.NODE_ENV === "stage")
    );
  }

  public static isServer(): boolean {
    return typeof window === "undefined";
  }

  public static isDevServer(): boolean {
    return EnvChecker.isServer() && process.env.NODE_ENV === "development";
  }

  public static isBot(): boolean {
    if (!EnvChecker.isServer()) {
      const userAgent = navigator.userAgent;
      return isBot(userAgent);
    } else {
      return false;
    }
  }

  public static getOrigin(): string {
    if (EnvChecker.isStage()) {
      return "https://stage.scinapse.io";
    } else {
      return "https://scinapse.io";
    }
  }
}
