const IP_REGEX = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

const STAGE_SERVER_HOST_NAME = "search-stage.pluto.network";

export default class EnvChecker {
  public static isDev(): boolean {
    return (
      window.location.hostname &&
      (window.location.hostname.includes("localhost") ||
        window.location.hostname.includes("lvh.me") ||
        IP_REGEX.test(window.location.hostname))
    );
  }

  public static isStage(): boolean {
    return window.location.hostname && window.location.hostname.includes(STAGE_SERVER_HOST_NAME);
  }

  public static getOrigin(): string {
    if (EnvChecker.isDev()) {
      return `${window.location.origin}/?#`;
    } else {
      return window.location.origin;
    }
  }

  public static isServer(): boolean {
    return typeof window === "undefined";
  }
}
