const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

const STAGE_SERVER_HOST_NAME = "search-stage.pluto.network";

export default class EnvChecker {
  public static isDev(): boolean {
    return (
      !EnvChecker.isServer() &&
      window.location.hostname &&
      (window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("lvh.me") ||
        IP_REGEX.test(window.location.hostname))
    );
  }

  public static isStage(): boolean {
    return (
      !EnvChecker.isServer() && window.location.hostname && window.location.hostname.includes(STAGE_SERVER_HOST_NAME)
    );
  }

  public static getOrigin(): string {
    if (EnvChecker.isServer()) {
      return "/";
    } else {
      return window.location.origin;
    }
  }

  public static isServer(): boolean {
    return typeof window === "undefined";
  }

  public static isDevServer(): boolean {
    return EnvChecker.isServer() && process.env.NODE_ENV === "development";
  }
}
