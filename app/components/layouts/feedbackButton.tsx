import * as React from "react";
import * as H from "history";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import FeedbackManager from "@pluto_network/scinapse-feedback";
import * as Cookies from "js-cookie";
import Icon from "../../icons";
import { withStyles } from "../../helpers/withStylesHelper";
import { trackEvent } from "../../helpers/handleGA";
import { CurrentUser } from "../../model/currentUser";
declare var ga: any;
const styles = require("./feedbackButton.scss");

interface FeedbackButtonProps {
  currentUser: CurrentUser;
  location: H.Location;
}

interface FeedbackButtonStates {
  isPopoverOpen: boolean;
  isLoadingFeedback: boolean;
  emailInput: string;
  feedbackContent: string;
}

@withStyles<typeof FeedbackButton>(styles)
class FeedbackButton extends React.PureComponent<FeedbackButtonProps, FeedbackButtonStates> {
  public state: FeedbackButtonStates = {
    isPopoverOpen: false,
    isLoadingFeedback: false,
    emailInput: "",
    feedbackContent: "",
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
    const { isPopoverOpen, emailInput, feedbackContent, isLoadingFeedback } = this.state;

    return (
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
        <Popover
          open={isPopoverOpen}
          classes={{ paper: styles.popoverPaper }}
          anchorEl={this.popoverAnchorEl!}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          transformOrigin={{ horizontal: "right", vertical: "bottom" }}
          onClose={this.handleCloseRequest}
        >
          <div className={styles.greetingBoxWrapper}>
            <div className={styles.greetingBox}>Hi, There! 👋</div>
          </div>
          <div className={styles.dropdownMenuWrapper}>
            <div className={styles.dropdownTitle}>
              {// tslint:disable-next-line:max-line-length
              `Is Scinapse helping your research?\nPlease share your experience, and make us work for you!\nWe'll try best to reflect your feedback and make it better.`}
            </div>
            <MenuItem onClick={this.handleCloseRequest} classes={{ root: styles.menuItem }}>
              <a
                className={styles.menuItemContent}
                target="_blank"
                // tslint:disable-next-line:max-line-length
                href="https://docs.google.com/forms/d/e/1FAIpQLSeqrI59V-HlbaL1HaudUi1rSE1WEuMpBI-6iObJ-wHM7NhRWA/viewform?usp=sf_link"
              >
                1-miniute User Survey ✍️
              </a>
            </MenuItem>
            <MenuItem onClick={this.handleCloseRequest} classes={{ root: styles.menuItem }}>
              <a className={styles.menuItemContent} href="mailto:team@pluto.network">
                Send E-Mail ✉️
              </a>
            </MenuItem>
            <MenuItem onClick={this.handleCloseRequest} classes={{ root: styles.menuItem }}>
              <a target="_blank" className={styles.menuItemContent} href="https://t.me/plutonetwork">
                Telegram 🗣
              </a>
            </MenuItem>

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
          </div>
        </Popover>
      </div>
    );
  }

  private countAndOpenFeedback = () => {
    const rawPVCount = Cookies.get("pvForFeedback");
    const PVCount = parseInt(rawPVCount || "0", 10);

    if (PVCount > 3) {
      this.handleToggleRequest();
      Cookies.set("pvForFeedback", "0");
    } else {
      Cookies.set("pvForFeedback", (PVCount + 1).toString());
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
    const { emailInput, feedbackContent } = this.state;

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

      trackEvent({ category: "Feedback Action", action: "Send feedback" });

      this.setState(prevState => ({ ...prevState, isLoadingFeedback: false, emailInput: "", feedbackContent: "" }));
    } catch (err) {
      console.error(err);
      alert(err);
      this.setState(prevState => ({ ...prevState, isLoadingFeedback: false }));
    }
  };

  private handleToggleRequest = (e?: React.MouseEvent<HTMLDivElement>) => {
    const isDirectOpen = !this.state.isPopoverOpen && e;
    const isAutoOpen = !this.state.isPopoverOpen && !e;

    if (isDirectOpen) {
      trackEvent({ category: "Feedback Action", action: "Toggle Feedback" });
    } else if (isAutoOpen) {
      trackEvent({ category: "Feedback Action", action: "Open Automatically" });
    }

    this.setState(prevState => ({ ...prevState, isPopoverOpen: !prevState.isPopoverOpen }));
  };

  private handleCloseRequest = () => {
    this.setState(prevState => ({ ...prevState, isPopoverOpen: false }));
  };
}

export default FeedbackButton;
