import * as React from "react";
import * as Cookies from "js-cookie";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./authContextText.scss");

const SEARCH_CONTEXT_TEXT_TEST_ID = "searchContextTextTest";

interface AuthContextTextProps {
  userActionType?: Scinapse.ActionTicket.ActionTagType;
  query?: string;
}

interface ContextTextByActionTypeProps extends AuthContextTextProps {
  searchContextTextTestUserType?: string;
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

const ContextTextByActionType: React.FunctionComponent<ContextTextByActionTypeProps> = React.memo(props => {
  const { userActionType, query, searchContextTextTestUserType } = props;

  const getQueryContextForMultiTest = () => {
    switch (searchContextTextTestUserType) {
      case "A":
        return "⚠️ Oops, only scinapse members can search more.";
      case "B":
        return "Sign up to Scinapse and search more 🔍";
      case "C":
        return "By being a member, Scinapse will support your research 😎";
      case "D":
        return "Become a member! Scinapse will fully support your research 🔍";
      case "E":
        return `🔍 To ${query} more, you need to be a Scinapse member.`;
      default:
        return "⚠️ Oops, only scinapse members can search more.";
    }
  };

  switch (userActionType) {
    case "downloadPdf":
      return <ContextText subText={"⚠️ Oops, only scinapse members can download PDF more."} />;
    case "citePaper":
      return <ContextText subText={"⚠️ Oops, only scinapse members can copy citation."} />;
    case "viewMorePDF":
      return <ContextText subText={"⚠️ Oops, only scinapse members can view full text."} />;
    case "query":
      return <ContextText subText={getQueryContextForMultiTest()} />;
    case "paperShow":
      return <ContextText subText={"⚠️ Oops, only scinapse members can view paper information more."} />;
    default:
      return null;
  }
});

const AuthContextText: React.FunctionComponent<AuthContextTextProps> = props => {
  const { userActionType } = props;
  const searchContextTextTestUserType = Cookies.get(SEARCH_CONTEXT_TEXT_TEST_ID) || "";

  return (
    <ContextTextByActionType
      userActionType={userActionType}
      searchContextTextTestUserType={searchContextTextTestUserType}
    />
  );
};

export default withStyles<typeof AuthContextText>(styles)(AuthContextText);
