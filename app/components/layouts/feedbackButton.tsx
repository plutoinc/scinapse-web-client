import * as React from "react";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "../../icons";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./feedbackButton.scss");

interface FeedbackButtonStates {
  isPopoverOpen: boolean;
}

@withStyles<typeof FeedbackButton>(styles)
class FeedbackButton extends React.Component<{}, FeedbackButtonStates> {
  public state: FeedbackButtonStates = {
    isPopoverOpen: false
  };

  private popoverAnchorEl: HTMLElement | null;

  public render() {
    const { isPopoverOpen } = this.state;

    const menuItemStyle: React.CSSProperties = {
      fontFamily: "Roboto",
      fontSize: "14px",
      textAlign: "center",
      color: "#6096ff",
      borderTop: "solid 1px #d8dde7"
    };

    return (
      <div>
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
            <MenuItem onClick={this.handleCloseRequest} style={menuItemStyle}>
              <a
                className={styles.menuItemContent}
                target="_blank"
                // tslint:disable-next-line:max-line-length
                href="https://docs.google.com/forms/d/e/1FAIpQLSeqrI59V-HlbaL1HaudUi1rSE1WEuMpBI-6iObJ-wHM7NhRWA/viewform?usp=sf_link"
              >
                1-miniute User Survey ✍️
              </a>
            </MenuItem>
            <MenuItem onClick={this.handleCloseRequest} style={menuItemStyle}>
              <a
                className={styles.menuItemContent}
                href="mailto:team@pluto.network"
              >
                Send E-Mail ✉️
              </a>
            </MenuItem>
            <MenuItem onClick={this.handleCloseRequest} style={menuItemStyle}>
              <a
                target="_blank"
                className={styles.menuItemContent}
                href="https://t.me/plutonetwork"
              >
                Direct Conversation 🗣
              </a>
            </MenuItem>
          </div>
        </Popover>
      </div>
    );
  }

  private handleToggleRequest = (_e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen
    });
  };

  private handleCloseRequest = () => {
    this.setState({
      isPopoverOpen: false
    });
  };
}

export default FeedbackButton;
