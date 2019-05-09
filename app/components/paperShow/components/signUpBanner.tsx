import * as React from "react";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { withStyles } from "../../../helpers/withStylesHelper";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { getUserGroupName } from "../../../helpers/abTestHelper";
import {
  SIGN_BANNER_AT_PAPER_SHOW_BANNER_TEST,
  SIGN_BANNER_AT_PAPER_SHOW_TITLE_TEXT_TEST,
} from "../../../constants/abTestGlobalValue";
const styles = require("./signUpBanner.scss");

interface SignBannerProps {
  isLoggedIn: boolean;
}

const SignBannerTitleText: React.FunctionComponent<{ userGroupName: string }> = React.memo(props => {
  const { userGroupName } = props;
  let titleText: string = "";

  switch (userGroupName) {
    case "areyouresearcher":
      titleText = "Are you a\nresearcher?";
      break;
    case "bemember":
      titleText = "Be a\nScinapse Member";
      break;
    case "unleashyourlimit":
      titleText = "Unleash\nYour Limit";
      break;
    default:
      return null;
  }

  return <div className={styles.bannerTitle}>{titleText}</div>;
});

const OpenSignUpModalBtn: React.FunctionComponent<{}> = React.memo(() => {
  return (
    <div className={styles.bannerSignButtonWrapper}>
      <button
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: "searchResult",
            actionType: "fire",
            actionArea: "signBanner",
            actionTag: "signUpPopup",
            actionLabel: "signBannerAtPaperShow",
            expName: "signBannerAtPaperShow",
          });

          GlobalDialogManager.openSignUpDialog({
            authContext: {
              pageType: "paperShow",
              actionArea: "signBanner",
              actionLabel: "signBannerAtPaperShow",
              expName: "signBannerAtPaperShow",
            },
            userActionType: "signBannerAtPaperShow",
          });
        }}
        className={styles.bannerSignButton}
      >
        Sign Up
      </button>
    </div>
  );
});

const SignUpBanner: React.FunctionComponent<SignBannerProps> = props => {
  const { isLoggedIn } = props;

  const signBannerUserGroupName: string = getUserGroupName(SIGN_BANNER_AT_PAPER_SHOW_BANNER_TEST) || "";

  const isBannerShow = signBannerUserGroupName === "banner";

  if (isLoggedIn || !isBannerShow) {
    return null;
  }

  const TitleTextUserGroupName: string = getUserGroupName(SIGN_BANNER_AT_PAPER_SHOW_TITLE_TEXT_TEST) || "";

  ActionTicketManager.trackTicket({
    pageType: "paperShow",
    actionType: "view",
    actionArea: "signBanner",
    actionTag: "bannerView",
    actionLabel: "signBannerAtPaperShow",
    expName: "signBannerAtPaperShow",
  });

  return (
    <div className={styles.bannerContainer}>
      <SignBannerTitleText userGroupName={TitleTextUserGroupName} />
      <OpenSignUpModalBtn />
    </div>
  );
};

export default withStyles<typeof styles>(styles)(SignUpBanner);
