import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "../../../../helpers/withStylesHelper";
import {
  SIGN_BANNER_AT_SEARCH_TITLE_TEXT_TEST,
  SIGN_BANNER_AT_SEARCH_BODY_TEXT_TEST,
  SIGN_BANNER_AT_SEARCH_SIGN_BUTTON_TEXT_TEST,
  SIGN_BANNER_AT_SEARCH_BANNER_TEST,
} from "../../../../constants/abTestGlobalValue";
import { getUserGroupName } from "../../../../helpers/abTestHelper";
import GlobalDialogManager from "../../../../helpers/globalDialogManager";
import ActionTicketManager from "../../../../helpers/actionTicketManager";
const styles = require("./signBanner.scss");

interface SignBannerProps {
  isLoading: boolean;
}

interface SignBannerContextProps {
  userGroupName: string;
}

const SignBannerTitleText: React.FunctionComponent<SignBannerContextProps> = React.memo(props => {
  const { userGroupName } = props;
  let titleText: string = "";

  switch (userGroupName) {
    case "unlimited":
      titleText = "Unlimited Scinapse";
      break;
    case "areyouresearcher":
      titleText = "Are you a researcher?";
      break;
    case "bemember":
      titleText = "Be a Scinapse Member";
      break;
    default:
      return null;
  }

  return <div className={styles.bannerTitle}>{titleText}</div>;
});

const SignBannerBodyText: React.FunctionComponent<SignBannerContextProps> = React.memo(props => {
  const { userGroupName } = props;

  let bodyText: string = "";

  switch (userGroupName) {
    case "a":
      bodyText = "Become a Scinapse member. Members can use all features unlimitedly.";
      break;
    case "b":
      bodyText = "Become a Scinapse member. You can use all features unlimitedly.";
      break;
    case "c":
      bodyText = "Become a Scinapse member. We focus on features for current researchers.";
      break;
    default:
      return null;
  }

  return <div className={styles.bannerBody}>{bodyText}</div>;
});

const SignBannerSignButtonText: React.FunctionComponent<SignBannerContextProps> = React.memo(props => {
  const { userGroupName } = props;
  let signButtonText: string = "";

  switch (userGroupName) {
    case "joinnow":
      signButtonText = "Join Now";
      break;
    case "registernow":
      signButtonText = "Register Now";
      break;
    case "signup":
      signButtonText = "Sign Up";
      break;
    case "yesofcourse":
      signButtonText = "Yes, of course";
      break;
    default:
      return null;
  }

  return (
    <div className={styles.bannerSignButtonWrapper}>
      <button
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType: "searchResult",
            actionType: "fire",
            actionArea: "signBanner",
            actionTag: "signUpPopup",
            actionLabel: "signBannerAtSearch",
            expName: "signBannerAtSearch",
          });

          GlobalDialogManager.openSignUpDialog({
            authContext: {
              pageType: "searchResult",
              actionArea: "signBanner",
              actionLabel: "signBannerAtSearch",
              expName: "signBannerAtSearch",
            },
            userActionType: "signBannerAtSearch",
          });
        }}
        className={styles.bannerSignButton}
      >
        {signButtonText}
      </button>
    </div>
  );
});
const SignBanner: React.FunctionComponent<SignBannerProps> = props => {
  const { isLoading } = props;

  const signBannerUserGroupName: string = getUserGroupName(SIGN_BANNER_AT_SEARCH_BANNER_TEST) || "";

  const isBannerShow = signBannerUserGroupName === "banner";

  if (!isBannerShow) {
    return null;
  }

  if (isLoading) {
    return (
      <div className={styles.bannerContainer}>
        <div className={styles.loadingContainer}>
          <CircularProgress size={100} thickness={2} style={{ color: "#d8dde7" }} />
        </div>
      </div>
    );
  }

  const TitleTextUserGroupName: string = getUserGroupName(SIGN_BANNER_AT_SEARCH_TITLE_TEXT_TEST) || "";
  const BodyTextUserGroupName: string = getUserGroupName(SIGN_BANNER_AT_SEARCH_BODY_TEXT_TEST) || "";
  const SignButtonTextUserName: string = getUserGroupName(SIGN_BANNER_AT_SEARCH_SIGN_BUTTON_TEXT_TEST) || "";

  ActionTicketManager.trackTicket({
    pageType: "searchResult",
    actionType: "view",
    actionArea: "signBanner",
    actionTag: "bannerView",
    actionLabel: "signBannerAtSearch",
    expName: "signBannerAtSearch",
  });

  return (
    <div className={styles.bannerContainer}>
      <SignBannerTitleText userGroupName={TitleTextUserGroupName} />
      <SignBannerBodyText userGroupName={BodyTextUserGroupName} />
      <div className={styles.bannerImageWrapper}>
        <picture>
          <source srcSet={"https://assets.pluto.network/signup_modal/researchers.webp"} type="image/webp" />
          <source srcSet={"https://assets.pluto.network/signup_modal/researchers.jpg"} type="image/jpeg" />
          <img
            className={styles.bannerImage}
            src={"https://assets.pluto.network/signup_modal/researchers.jpg"}
            alt={"bannerImage"}
          />
        </picture>
      </div>
      <SignBannerSignButtonText userGroupName={SignButtonTextUserName} />
    </div>
  );
};

export default withStyles<typeof styles>(styles)(SignBanner);
