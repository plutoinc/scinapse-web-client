import { UAParser } from "ua-parser-js";
import EnvChecker from "./envChecker";

class UserAgentHelper {
  private parser: any;

  public constructor(userAgent: string) {
    this.parser = new UAParser(userAgent);
  }

  public getBrowser() {
    if (this.parser) {
      return this.parser.getBrowser();
    }
  }

  public getDevice() {
    if (this.parser) {
      return this.parser.getDevice();
    }
  }
}

let userAgent = "";
if (!EnvChecker.isOnServer()) {
  if (navigator) {
    userAgent = navigator.userAgent;
  }
}

const userAgentHelper = new UserAgentHelper(userAgent);

export default userAgentHelper;
