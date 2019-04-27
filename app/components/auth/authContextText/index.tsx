import * as React from "react";
import { Dispatch } from "react-redux";
import { withStyles } from "../../../helpers/withStylesHelper";
import { getUserGroupName } from "../../../helpers/abTestHelper";
import {
  SIGN_UP_CONTEXT_TEST_NAME,
  COMPLETE_BLOCK_SIGN_UP_TEST_USER_GROUP,
} from "../../../constants/abTestGlobalValue";
import { controlSignUpContext, positiveSignUpContext } from "./constants";
import DialogCloseButton from "../authButton/dialogCloseButton";
const styles = require("./authContextText.scss");

interface AuthContextTextProps {
  dispatch: Dispatch<any>;
  userActionType?: Scinapse.ActionTicket.ActionTagType;
}

export const ContextText: React.FunctionComponent<{
  subText: string;
  dispatch: Dispatch<any>;
}> = React.memo(props => {
  const { subText, dispatch } = props;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <span className={styles.contentText}>{subText}</span>
        {COMPLETE_BLOCK_SIGN_UP_TEST_USER_GROUP === "closeIconTop" ? <DialogCloseButton dispatch={dispatch} /> : null}
      </div>
    </div>
  );
});

function getContextValueSignUpContextTest(
  userGroupName: string,
  userActionType: Scinapse.ActionTicket.ActionTagType,
  dispatch: Dispatch<any>
) {
  switch (userGroupName) {
    case "control":
      return <ContextText subText={controlSignUpContext[userActionType]} dispatch={dispatch} />;
    case "positive":
      return <ContextText subText={positiveSignUpContext[userActionType]} dispatch={dispatch} />;
    default:
      return null;
  }
}

const ContextTextByActionType: React.FunctionComponent<AuthContextTextProps> = React.memo(props => {
  const { userActionType, dispatch } = props;

  const userGroup: string = getUserGroupName(SIGN_UP_CONTEXT_TEST_NAME) || "";

  return userActionType ? getContextValueSignUpContextTest(userGroup, userActionType, dispatch) : null;
});

const AuthContextText: React.FunctionComponent<AuthContextTextProps> = props => {
  const { userActionType, dispatch } = props;

  return <ContextTextByActionType dispatch={dispatch} userActionType={userActionType} />;
};

export default withStyles<typeof AuthContextText>(styles)(AuthContextText);
