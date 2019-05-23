import * as React from "react";
import Popper from "@material-ui/core/Popper";
import { withStyles } from "../../helpers/withStylesHelper";
import { getBlockedBubbleContext } from "./constants";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../helpers/checkAuthDialog";
const styles = require("./blockedPopper.scss");

interface BlockedPopperProps {
  isOpen: boolean;
  handleOnClickAwayFunc: () => void;
  anchorEl: HTMLDivElement | null;
  buttonClickAction: Scinapse.ActionTicket.ActionTagType;
}

const BlockedPopperContent: React.FC<{
  userGroupName: string;
  buttonClickAction: Scinapse.ActionTicket.ActionTagType;
  onClickAwayButton: () => void;
}> = props => {
  const { userGroupName, buttonClickAction, onClickAwayButton } = props;
  const bubbleContext = getBlockedBubbleContext(userGroupName, buttonClickAction);

  return (
    <div className={styles.bubbleContent}>
      <div className={styles.titleContext}>{bubbleContext.title}</div>
      <div className={styles.mainContext}>{bubbleContext.mainText}</div>
      <button
        className={styles.joinBtn}
        onClick={e => {
          e.preventDefault();
          blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: "paperDescription",
            actionLabel: buttonClickAction,
            userActionType: buttonClickAction,
          });
          onClickAwayButton();
        }}
      >
        Join Now
      </button>
    </div>
  );
};

const BlockedPopper: React.FC<BlockedPopperProps> = props => {
  const { isOpen, anchorEl, buttonClickAction, handleOnClickAwayFunc } = props;
  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      placement="bottom"
      style={{ zIndex: 2 }}
      disablePortal={true}
      modifiers={{ flip: { enabled: false } }}
    >
      <BlockedPopperContent
        userGroupName={"1"}
        buttonClickAction={buttonClickAction}
        onClickAwayButton={handleOnClickAwayFunc}
      />
    </Popper>
  );
};

export default withStyles<typeof styles>(styles)(BlockedPopper);
