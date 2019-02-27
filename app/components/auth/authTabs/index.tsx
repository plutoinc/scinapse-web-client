import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const s = require("./authTabs.scss");

interface AuthTabsProps {}

const AuthTabs: React.FunctionComponent<AuthTabsProps> = () => {
  return (
    <div>
      <div>SIGN IN</div>
      <div>SIGN UP</div>
    </div>
  );
};

export default withStyles<typeof AuthTabs>(s)(AuthTabs);
