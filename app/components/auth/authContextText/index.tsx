import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { getUserGroupName, getContextValueSignUpContextTest } from "../../../helpers/abTestHelper";
import { SIGN_UP_CONTEXT_TEST_NAME } from "../../../constants/abTestGlobalValue";
const styles = require("./authContextText.scss");

interface AuthContextTextProps {
  userActionType?: Scinapse.ActionTicket.ActionTagType;
  query?: string;
}

export const ContextText: React.FunctionComponent<{
  subText: string;
}> = React.memo(props => {
  const { subText } = props;

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <span className={styles.contentText}>{subText}</span>
      </div>
    </div>
  );
});

const ContextTextByActionType: React.FunctionComponent<AuthContextTextProps> = React.memo(props => {
  const { userActionType } = props;

  const userGroup: string = getUserGroupName(SIGN_UP_CONTEXT_TEST_NAME) || "";

  return userActionType ? getContextValueSignUpContextTest(userGroup, userActionType) : null;
});

const AuthContextText: React.FunctionComponent<AuthContextTextProps> = props => {
  const { userActionType } = props;

  return <ContextTextByActionType userActionType={userActionType} />;
};

export default withStyles<typeof AuthContextText>(styles)(AuthContextText);
