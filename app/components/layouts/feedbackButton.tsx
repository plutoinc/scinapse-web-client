import * as React from "react";
import * as H from "history";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FeedbackManager from "@pluto_network/scinapse-feedback";
import * as Cookies from "js-cookie";
import Icon from "../../icons";
import { withStyles } from "../../helpers/withStylesHelper";
import { trackEvent } from "../../helpers/handleGA";
import { CurrentUser } from "../../model/currentUser";
import { LayoutState, UserDevice } from "./records";
declare var ga: any;
const styles = require("./feedbackButton.scss");

interface FeedbackButtonProps {
  currentUser: CurrentUser;
  location: H.Location;
  layout: LayoutState;
}

interface FeedbackButtonStates {
  isPopoverOpen: boolean;
  isLoadingFeedback: boolean;
  emailInput: string;
  feedbackContent: string;
  isAutoOpen: boolean;
  hasSentFeedback: boolean;
}

const FEEDBACK_PV_COOKIE_KEY = "pvForFeedback";
const FEEDBACK_ALREADY_SENT = "pvAlreadySent";

@withStyles<typeof FeedbackButton>(styles)
class FeedbackButton extends React.PureComponent<FeedbackButtonProps, FeedbackButtonStates> {
  public state: FeedbackButtonStates = {
    isPopoverOpen: false,
    isLoadingFeedback: false,
    emailInput: "",
    feedbackContent: "",
    isAutoOpen: false,
    hasSentFeedback: false,
  };

  private popoverAnchorEl: HTMLElement | null;

  public componentDidMount() {
    this.countAndOpenFeedback();
  }

  public componentWillReceiveProps(nextProps: FeedbackButtonProps) {
    if (this.props.location !== nextProps.location) {
      this.countAndOpenFeedback();
    }
  }

  public render() {
    const { layout, location, currentUser } = this.props;
    const { isPopoverOpen } = this.state;

    if (layout.userDevice !== UserDevice.DESKTOP) {
      return null;
    }
    if ("papers" === location.pathname.split("/")[1] && currentUser.isLoggedIn) {
      return null;
    }

    return (
      <ClickAwayListener onClickAway={this.handleCloseRequest}>
        <div className={`${styles.feedbackButtonBox} mui-fixed`}>
          <div
            ref={el => (this.popoverAnchorEl = el)}
            onClick={e => {
              this.handleToggleRequest(e);
            }}
            className={styles.feedbackButtonWrapper}
          >
            <Icon icon="FEEDBACK_PENCIL" className={styles.feedbackButtonIcon} />
            <span>Feedback</span>
          </div>

          <Popper open={isPopoverOpen} anchorEl={this.popoverAnchorEl!} placement="top-end" disablePortal={true}>
            <div className={styles.popperPaper}>
              <div className={styles.greetingBoxWrapper}>
                <div className={styles.greetingBox}>Hi, There! 👋</div>
              </div>
              <div className={styles.dropdownMenuWrapper}>
                <div
                  className={styles.dropdownTitle}
                >{`Have any trouble?\nSee our FAQ, or just drop us a message!`}</div>
                <MenuItem onClick={this.handleCloseRequest} classes={{ root: styles.menuItem }}>
                  <a
                    onClick={this.trackClickMenu}
                    target="_blank"
                    className={styles.menuItemContent}
                    href="https://www.notion.so/pluto/Frequently-Asked-Questions-4b4af58220aa4e00a4dabd998206325c"
                  >
                    FAQ
                  </a>
                </MenuItem>
                {this.getDirectFeedbackOrSurveyMenu()}
              </div>
            </div>
          </Popper>
        </div>
      </ClickAwayListener>
    );
  }

  private getDirectFeedbackOrSurveyMenu = () => {
    const { hasSentFeedback, emailInput, feedbackContent, isLoadingFeedback } = this.state;

    if (!hasSentFeedback) {
      return (
        <div className={styles.feedbackInput}>
          <div className={styles.feedbackHeader}>Direct Feedback 📣</div>

          <form onSubmit={this.handleSubmitFeedbackForm} className={styles.feedbackForm}>
            <div className={styles.formStyle}>
              <label>E-Mail (Optional)</label>
              <input type="email" value={emailInput} onChange={this.handleChangeEmail} />
            </div>
            <div className={styles.formStyle}>
              <label>Feedback</label>
              <textarea value={feedbackContent} onChange={this.handleChangeFeedback} />
            </div>
            <div className={styles.btnWrapper}>
              <button>{!isLoadingFeedback ? "Send Feedback" : "is loading ..."}</button>
            </div>
          </form>
        </div>
      );
    }
    return (
      <MenuItem onClick={this.handleCloseRequest} classes={{ root: styles.menuItem }}>
        <a
          className={styles.menuItemContent}
          target="_blank"
          onClick={this.trackClickMenu}
          // tslint:disable-next-line:max-line-length
          href="https://docs.google.com/forms/d/e/1FAIpQLSeqrI59V-HlbaL1HaudUi1rSE1WEuMpBI-6iObJ-wHM7NhRWA/viewform?usp=sf_link"
        >
          1-Minute User Survey ✍️
        </a>
      </MenuItem>
    );
  };

  private trackClickMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { isAutoOpen } = this.state;
    const rawPVCount = Cookies.get(FEEDBACK_PV_COOKIE_KEY) || 0;
    const menu = e.currentTarget.innerText;

    trackEvent({
      category: "Feedback Action",
      action: `Click Feedback Menu ${menu}`,
      label: `pv: ${rawPVCount}, autoOpen: ${isAutoOpen}`,
    });
  };

  private countAndOpenFeedback = () => {
    const alreadySentFeedbackRecently = Cookies.get(FEEDBACK_ALREADY_SENT);

    if (alreadySentFeedbackRecently) {
      return;
    }

    const rawPVCount = Cookies.get(FEEDBACK_PV_COOKIE_KEY);
    const PVCount = parseInt(rawPVCount || "0", 10);

    const targetPVList = [30, 50, 70, 100];

    if (targetPVList.includes(PVCount)) {
      this.handleToggleRequest();
      Cookies.set(FEEDBACK_PV_COOKIE_KEY, (PVCount + 1).toString());
    } else if (PVCount > 100) {
      Cookies.set(FEEDBACK_PV_COOKIE_KEY, "0");
    } else {
      Cookies.set(FEEDBACK_PV_COOKIE_KEY, (PVCount + 1).toString());
    }
  };

  private handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, emailInput: newValue }));
  };

  private handleChangeFeedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.currentTarget.value;

    this.setState(prevState => ({ ...prevState, feedbackContent: newValue }));
  };

  private handleSubmitFeedbackForm = async (e: React.FormEvent<HTMLFormElement>) => {
    const { currentUser } = this.props;
    const { emailInput, feedbackContent, isAutoOpen } = this.state;
    const rawPVCount = Cookies.get(FEEDBACK_PV_COOKIE_KEY) || 0;

    e.preventDefault();

    if (!feedbackContent || feedbackContent.length <= 5) {
      alert("You should leave more than 5 character of the feedback content");
      return;
    }

    const feedbackManger = new FeedbackManager();

    let gaId = "";
    if (typeof ga !== "undefined") {
      ga((tracker: any) => {
        gaId = tracker.get("clientId");
      });
    }

    let href: string = "";
    if (typeof window !== "undefined") {
      href = window.location.href;
    }

    try {
      this.setState(prevState => ({ ...prevState, isLoadingFeedback: true }));

      await feedbackManger.sendFeedback({
        content: feedbackContent,
        email: emailInput,
        referer: href,
        userId: currentUser.isLoggedIn ? currentUser.id.toString() : "",
        gaId,
      });

      trackEvent({
        category: "Feedback Action",
        action: "Send feedback",
        label: `pv: ${rawPVCount}, autoOpen: ${isAutoOpen}`,
      });

      this.setState(prevState => ({
        ...prevState,
        isLoadingFeedback: false,
        emailInput: "",
        feedbackContent: "",
        hasSentFeedback: true,
      }));

      Cookies.set(FEEDBACK_ALREADY_SENT, "true", { expires: 10 });
    } catch (err) {
      console.error(err);
      alert(err);
      this.setState(prevState => ({ ...prevState, isLoadingFeedback: false }));
    }
  };

  private handleToggleRequest = (e?: React.MouseEvent<HTMLDivElement>) => {
    const isDirectOpen = !this.state.isPopoverOpen && e;
    const isAutoOpen = !this.state.isPopoverOpen && !e;
    const rawPVCount = Cookies.get(FEEDBACK_PV_COOKIE_KEY) || 0;

    if (isDirectOpen) {
      trackEvent({ category: "Feedback Action", action: "Toggle Feedback", label: `pv: ${rawPVCount}` });
      this.setState(prevState => ({ ...prevState, isPopoverOpen: !prevState.isPopoverOpen, isAutoOpen: false }));
    } else if (isAutoOpen) {
      trackEvent({ category: "Feedback Action", action: "Open Automatically", label: `pv: ${rawPVCount}` });
      this.setState(prevState => ({ ...prevState, isPopoverOpen: !prevState.isPopoverOpen, isAutoOpen: true }));
    } else {
      this.setState(prevState => ({ ...prevState, isPopoverOpen: !prevState.isPopoverOpen, isAutoOpen: false }));
    }
  };

  private handleCloseRequest = () => {
    this.setState(prevState => ({ ...prevState, isPopoverOpen: false, isAutoOpen: false }));
  };
}

export default FeedbackButton;
