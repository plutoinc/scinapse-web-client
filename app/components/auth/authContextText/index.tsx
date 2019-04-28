import * as React from "react";
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
  userActionType?: Scinapse.ActionTicket.ActionTagType;
}

export const ContextText: React.FunctionComponent<{
  subText: string;
}> = React.memo(props => {
  const { subText } = props;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <span className={styles.contentText}>{subText}</span>
        {COMPLETE_BLOCK_SIGN_UP_TEST_USER_GROUP === "closeIconTop" ? <DialogCloseButton /> : null}
      </div>
    </div>
  );
});

const AuthContextText: React.FunctionComponent<AuthContextTextProps> = props => {
  const { userActionType } = props;
  const userGroup: string = getUserGroupName(SIGN_UP_CONTEXT_TEST_NAME) || "";

  if (!userActionType) {
    return null;
  }

  if (userGroup === "control") {
    return <ContextText subText={controlSignUpContext[userActionType]} />;
  }

  if (userGroup === "positive") {
    return <ContextText subText={positiveSignUpContext[userActionType]} />;
  }

  return null;
};

export default withStyles<typeof AuthContextText>(styles)(AuthContextText);
