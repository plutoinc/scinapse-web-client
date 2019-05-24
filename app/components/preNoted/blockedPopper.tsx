import * as React from "react";
import Popper from "@material-ui/core/Popper";
import { withStyles } from "../../helpers/withStylesHelper";
import { getBlockedBubbleContext } from "./constants";
import { blockUnverifiedUser, AUTH_LEVEL } from "../../helpers/checkAuthDialog";
import { BUBBLE_CONTEXT_TYPE } from "../../helpers/getBubbleContextType";
import ActionTicketManager from "../../helpers/actionTicketManager";
const store = require("store");
const styles = require("./blockedPopper.scss");

interface BlockedPopperProps {
  isOpen: boolean;
  handleOnClickAwayFunc: () => void;
  anchorEl: HTMLDivElement | null;
  buttonClickAction: Scinapse.ActionTicket.ActionTagType;
  actionArea?: string;
}

const BlockedPopperContent: React.FC<{
  buttonClickAction: Scinapse.ActionTicket.ActionTagType;
  onClickAwayButton: () => void;
  actionArea: string;
}> = props => {
  const { buttonClickAction, onClickAwayButton } = props;
  const bubbleContextType = String(store.get(BUBBLE_CONTEXT_TYPE));
  const bubbleContext = getBlockedBubbleContext(bubbleContextType, buttonClickAction);

  return (
    <div className={styles.bubbleContent}>
      <div className={styles.titleContext}>{bubbleContext.title}</div>
      <div className={styles.mainContext}>{bubbleContext.mainText}</div>
      <button
        className={styles.joinBtn}
        onClick={async e => {
          e.preventDefault();
          await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: "paperShow",
            actionLabel: buttonClickAction,
            userActionType: buttonClickAction,
            actionValue: bubbleContextType,
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
  const { isOpen, anchorEl, buttonClickAction, handleOnClickAwayFunc, actionArea } = props;

  if (isOpen) {
    ActionTicketManager.trackTicket({
      pageType: "paperShow",
      actionType: "view",
      actionArea: actionArea || "paperDescription",
      actionTag: "signBubbleView",
      actionLabel: buttonClickAction,
    });
  }

  return (
    <Popper
      open={isOpen}
      anchorEl={anchorEl}
      placement="bottom"
      style={{ zIndex: 11 }}
      disablePortal
      modifiers={{ flip: { enabled: false } }}
      popperOptions={{ positionFixed: true }}
    >
      <BlockedPopperContent
        buttonClickAction={buttonClickAction}
        onClickAwayButton={handleOnClickAwayFunc}
        actionArea={actionArea || "paperDescription"}
      />
    </Popper>
  );
};

export default withStyles<typeof styles>(styles)(BlockedPopper);
