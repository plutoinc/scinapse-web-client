import * as React from "react";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { withStyles } from "../../../helpers/withStylesHelper";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
import { getUserGroupName } from "../../../helpers/abTestHelper";
import {
  SIGN_BANNER_AT_PAPER_SHOW_BANNER_TEST,
  SIGN_BANNER_AT_PAPER_SHOW_TITLE_TEXT_TEST,
  SIGN_BANNER_AT_PAPER_SHOW_TITLE_TEXT_KEYVERB_TEST,
} from "../../../constants/abTestGlobalValue";
const styles = require("./signUpBanner.scss");

interface SignBannerProps {
  isLoggedIn: boolean;
}

const SignBannerTitleText: React.FunctionComponent<{ userGroupName: string; keyverb: string }> = React.memo(props => {
  const { userGroupName, keyverb } = props;
  let titleText = "";
  const keyverbText = keyverb === "enjoy" ? "Enjoy" : "Browse";

  switch (userGroupName) {
    case "onlymember":
      titleText = `Only\nMember\nCan ${keyverbText}\nScinapse`;
      break;
    case "youcanmore":
      titleText = `You\nCan ${keyverbText}\nScinapse\nMore`;
      break;
    case "enjoyeverything":
      titleText = `${keyverbText}\nEverything\nby Signing Up`;
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
            isBlocked: false,
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

  const titleTextUserGroupName: string = getUserGroupName(SIGN_BANNER_AT_PAPER_SHOW_TITLE_TEXT_TEST) || "";
  const titleTextKeyverbUserGroupName: string =
    getUserGroupName(SIGN_BANNER_AT_PAPER_SHOW_TITLE_TEXT_KEYVERB_TEST) || "";

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
      <SignBannerTitleText userGroupName={titleTextUserGroupName} keyverb={titleTextKeyverbUserGroupName} />
      <OpenSignUpModalBtn />
    </div>
  );
};

export default withStyles<typeof styles>(styles)(SignUpBanner);
