import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/reducer";
const s = require("./authTabs.scss");

type AuthTabTypes = "sign in" | "sign up";

interface AuthTabsProps {
  onClickTab: (tab: GLOBAL_DIALOG_TYPE) => void;
  activeTab: AuthTabTypes;
}

const AuthTabs: React.FunctionComponent<AuthTabsProps> = ({ onClickTab, activeTab }) => {
  return (
    <div className={s.authTab}>
      <div
        className={classNames({
          [s.authTabItem]: true,
          [s.active]: activeTab === "sign in",
        })}
        onClick={() => {
          onClickTab(GLOBAL_DIALOG_TYPE.SIGN_IN);
        }}
      >
        SIGN IN
      </div>
      <div
        className={classNames({
          [s.authTabItem]: true,
          [s.active]: activeTab === "sign up",
        })}
        onClick={() => {
          onClickTab(GLOBAL_DIALOG_TYPE.SIGN_UP);
        }}
      >
        SIGN UP
      </div>
    </div>
  );
};

export default withStyles<typeof AuthTabs>(s)(AuthTabs);
