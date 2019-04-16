import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./authContextText.scss");

interface AuthContextTextProps {
  userActionType?: Scinapse.ActionTicket.ActionTagType;
}

const ContextText: React.FunctionComponent<{
  subText: string;
}> = React.memo(props => {
  const { subText } = props;

  return (
    <div className={styles.contentWrapper}>
      <span className={styles.contentText}>{subText}</span>
    </div>
  );
});

const ContextTextByActionType: React.FunctionComponent<AuthContextTextProps> = React.memo(props => {
  const { userActionType } = props;

  switch (userActionType) {
    case "downloadPdf":
      return <ContextText subText={"⚠️ Oops, only scinapse members can download PDF more."} />;
    case "citePaper":
      return <ContextText subText={"⚠️ Oops, only scinapse members can copy citation."} />;
    case "viewMorePDF":
      return <ContextText subText={"⚠️ Oops, only scinapse members can view full text."} />;
    case "query":
      return <ContextText subText={"⚠️ Oops, only scinapse members can search more."} />;
    case "paperShow":
      return <ContextText subText={"⚠️ Oops, only scinapse members can view paper information more."} />;
    default:
      return null;
  }
});

const AuthContextText: React.FunctionComponent<AuthContextTextProps> = props => {
  const { userActionType } = props;
  return (
    <div className={styles.container}>
      <ContextTextByActionType userActionType={userActionType} />
    </div>
  );
};

export default withStyles<typeof AuthContextText>(styles)(AuthContextText);
