import * as React from "react";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { GLOBAL_DIALOG_TYPE } from "../../dialog/reducer";
import { Link } from "react-router-dom";
const s = require("./authTabs.scss");

type AuthTabTypes = "sign in" | "sign up";

interface AuthTabsProps {
  onClickTab: (tab: GLOBAL_DIALOG_TYPE) => void;
  activeTab: AuthTabTypes;
}

function pageAuthTabs(props: AuthTabsProps) {
  const { activeTab } = props;
  return (
    <div className={s.authTab}>
      <Link
        className={classNames({
          [s.authTabItem]: true,
          [s.active]: activeTab === "sign in",
        })}
        to="/users/sign_in"
      >
        SIGN IN
      </Link>
      <Link
        className={classNames({
          [s.authTabItem]: true,
          [s.active]: activeTab === "sign up",
        })}
        to="/users/sign_up"
      >
        SIGN UP
      </Link>
    </div>
  );
}

function dialogAuthTabs(props: AuthTabsProps) {
  const { onClickTab, activeTab } = props;
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
}

const AuthTabs: React.FunctionComponent<AuthTabsProps> = props => {
  const isDialog = !!props.onClickTab;

  return isDialog ? dialogAuthTabs(props) : pageAuthTabs(props);
};

export default withStyles<typeof AuthTabs>(s)(AuthTabs);
