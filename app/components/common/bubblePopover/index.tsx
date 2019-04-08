import * as React from "react";
import Popper, { PopperProps } from "@material-ui/core/Popper";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./bubblePopover.scss");

// tslint:disable-next-line:no-empty-interface
interface BubblePopoverProps extends PopperProps {}

const BubblePopover: React.SFC<BubblePopoverProps> = props => {
  const popperProps: BubblePopoverProps = {
    ...props,
    modifiers: {
      flip: {
        enabled: false,
      },
    },
  };

  return (
    <Popper {...popperProps} style={{ zIndex: 9999 }}>
      <div className={`${styles.speechBubble} ${props.className}`}>
        <div className={styles.contentWrapper}>{props.children}</div>
      </div>
    </Popper>
  );
};

export default withStyles<typeof BubblePopover>(styles)(BubblePopover);
