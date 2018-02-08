import * as React from "react";
import { Popover, Menu, MenuItem } from "material-ui";
import Icon from "../../icons";
const styles = require("./feedbackButton.scss");

interface FeedbackButtonStates {
  popoverAnchorEl?: React.ReactInstance;
  isPopoverOpen: boolean;
}

class FeedbackButton extends React.Component<{}, FeedbackButtonStates> {
  public state: FeedbackButtonStates = {
    isPopoverOpen: false,
  };

  private handleOpenRequest = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      isPopoverOpen: true,
      popoverAnchorEl: e.currentTarget,
    });
  };

  private handleCloseRequest = () => {
    this.setState({
      isPopoverOpen: false,
    });
  };

  public render() {
    const { isPopoverOpen, popoverAnchorEl } = this.state;

    const popoverStyle = {
      border: "solid 1px #d8dde7",
      borderRadius: " 3.2px",
      boxShadow: "none",
      marginTop: "-12.5px",
    };

    const dropdownMenuStyle = {
      width: "244px",
      borderRadius: " 3.2px",
    };

    const menuItemStyle = {
      fontFamily: "Roboto",
      fontSize: "13.5px",
      textAlign: "center",
      color: "#6096ff",
    };

    return (
      <div>
        <div
          onClick={e => {
            this.handleOpenRequest(e);
          }}
          className={styles.feedbackButtonWrapper}
        >
          <Icon icon="FEEDBACK_LOGO" className={styles.feedbackButtonIcon} />
        </div>
        <Popover
          open={isPopoverOpen}
          anchorEl={popoverAnchorEl}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          targetOrigin={{ horizontal: "right", vertical: "bottom" }}
          onRequestClose={this.handleCloseRequest}
          style={popoverStyle}
        >
          <div className={styles.greetingBox}>Hi, There! 👋</div>
          <Menu style={dropdownMenuStyle}>
            <div className={styles.dropdownTitle}>
              {`Is Pluto Beta helping your research?\nPlease share your experience, and make us work for you!\nWe'll try best to reflect your feedback and make it better.`}
            </div>
            <MenuItem style={menuItemStyle}>
              <a
                className={styles.menuItemContent}
                target="_blank"
                href="https://docs.google.com/forms/d/e/1FAIpQLSeqrI59V-HlbaL1HaudUi1rSE1WEuMpBI-6iObJ-wHM7NhRWA/viewform?usp=sf_link"
              >
                1-miniute User Survey ✍️
              </a>
            </MenuItem>
            <MenuItem style={menuItemStyle}>
              <a className={styles.menuItemContent} href="mailto:obama@whitehouse.gov">
                Send E-Mail ✉️
              </a>
            </MenuItem>
            <MenuItem style={menuItemStyle}>
              <a target="_blank" className={styles.menuItemContent} href="https://t.me/plutonetwork">
                Direct Conversation 🗣
              </a>
            </MenuItem>
          </Menu>
        </Popover>
      </div>
    );
  }
}

export default FeedbackButton;
