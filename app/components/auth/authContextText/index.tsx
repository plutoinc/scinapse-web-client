import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { getUserGroupName } from "../../../helpers/abTestHelper";
import { COMPLETE_BLOCK_SIGN_UP_TEST_NAME, SIGN_UP_CONTEXT_TEST_NAME } from "../../../constants/abTestGlobalValue";
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
        {getUserGroupName(COMPLETE_BLOCK_SIGN_UP_TEST_NAME) === "closeIconTop" ? <DialogCloseButton /> : null}
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

  let subText;
  switch (userGroup) {
    case "control":
      subText = controlSignUpContext[userActionType];
      break;
    case "positive":
      subText = positiveSignUpContext[userActionType];
      break;
    default:
  }

  if (!subText) {
    return null;
  }

  return <ContextText subText={subText} />;
};

export default withStyles<typeof AuthContextText>(styles)(AuthContextText);
