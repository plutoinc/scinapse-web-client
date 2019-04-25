import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ABTestType } from "../../../constants/abTest";
import { getUserGroupName } from "../../../helpers/abTestHelper";
import { controlSignUpContext, positiveSignUpContext } from "./constants";
const styles = require("./authContextText.scss");

interface AuthContextTextProps {
  userActionType?: Scinapse.ActionTicket.ActionTagType;
  query?: string;
}

const ContextText: React.FunctionComponent<{
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

  const testName: ABTestType = "signUpContextText";

  const userGroup: string = getUserGroupName(testName) || "";

  switch (userGroup) {
    case "control":
      return !!userActionType ? <ContextText subText={controlSignUpContext[userActionType]} /> : null;
    case "positive":
      return !!userActionType ? <ContextText subText={positiveSignUpContext[userActionType]} /> : null;
    default:
      return null;
  }
});

const AuthContextText: React.FunctionComponent<AuthContextTextProps> = props => {
  const { userActionType } = props;

  return <ContextTextByActionType userActionType={userActionType} />;
};

export default withStyles<typeof AuthContextText>(styles)(AuthContextText);
