import * as React from "react";
import { Popover, Menu, MenuItem } from "material-ui";
import Icon from "../../icons";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./feedbackButton.scss");

interface FeedbackButtonStates {
  popoverAnchorEl?: React.ReactInstance;
  isPopoverOpen: boolean;
}

@withStyles<typeof FeedbackButton>(styles)
class FeedbackButton extends React.Component<{}, FeedbackButtonStates> {
  public state: FeedbackButtonStates = {
    isPopoverOpen: false,
  };

  public render() {
    const { isPopoverOpen, popoverAnchorEl } = this.state;

    const popoverStyle = {
      width: 248,
      boxShadow: "none",
      marginTop: "-12.5px",
      marginLeft: "10px",
      backgroundColor: "transparent",
      left: "814px",
    };

    const dropdownMenuStyle = {
      borderRadius: "5px",
      border: "0",
      backgroundColor: "transparent",
      marginLeft: "10px",
    };

    const menuItemStyle = {
      fontFamily: "Roboto",
      fontSize: "14px",
      textAlign: "center",
      color: "#6096ff",
    };

    return (
      <div>
        <div
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
          anchorEl={popoverAnchorEl}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
          targetOrigin={{ horizontal: "right", vertical: "bottom" }}
          onRequestClose={this.handleCloseRequest}
          style={popoverStyle}
        >
          <div className={styles.greetingBoxWrapper}>
            <div className={styles.greetingBox}>Hi, There! 👋</div>
          </div>
          <Menu autoWidth={false} width="260px" style={dropdownMenuStyle}>
            <div className={styles.dropdownMenuWrapper}>
              <div className={styles.dropdownTitle}>
                {`Is Pluto Beta helping your research?\nPlease share your experience, and make us work for you!\nWe'll try best to reflect your feedback and make it better.`}
              </div>
              <MenuItem onClick={this.handleCloseRequest} style={menuItemStyle}>
                <a
                  className={styles.menuItemContent}
                  target="_blank"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeqrI59V-HlbaL1HaudUi1rSE1WEuMpBI-6iObJ-wHM7NhRWA/viewform?usp=sf_link"
                >
                  1-miniute User Survey ✍️
                </a>
              </MenuItem>
              <MenuItem onClick={this.handleCloseRequest} style={menuItemStyle}>
                <a className={styles.menuItemContent} href="mailto:obama@whitehouse.gov">
                  Send E-Mail ✉️
                </a>
              </MenuItem>
              <MenuItem onClick={this.handleCloseRequest} style={menuItemStyle}>
                <a target="_blank" className={styles.menuItemContent} href="https://t.me/plutonetwork">
                  Direct Conversation 🗣
                </a>
              </MenuItem>
            </div>
          </Menu>
        </Popover>
      </div>
    );
  }

  private handleToggleRequest = (e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen,
      popoverAnchorEl: e.currentTarget,
    });
  };

  private handleCloseRequest = () => {
    this.setState({
      isPopoverOpen: false,
    });
  };
}

export default FeedbackButton;
