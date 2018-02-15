import { UAParser } from "ua-parser-js";

class UserAgentHelper {
  private parser: any;

  constructor(userAgent: string) {
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
if (typeof navigator !== undefined && navigator) {
  userAgent = navigator.userAgent;
}

const userAgentHelper = new UserAgentHelper(userAgent);

export default userAgentHelper;
