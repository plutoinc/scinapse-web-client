import * as React from "react";
import Popover from "@material-ui/core/Popover";
import { PopoverProps } from "@material-ui/core/Popover";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./bubblePopover.scss");

interface BubblePopoverProps extends PopoverProps {
  menuItems?: React.ReactNode;
}

class BubblePopover extends React.Component<BubblePopoverProps> {
  public render() {
    return (
      <Popover
        className={styles.speechBubble}
        anchorEl={this.props.anchorEl}
        anchorOrigin={this.props.anchorOrigin}
        transformOrigin={this.props.transformOrigin}
        open={this.props.open}
        onClose={this.props.onClose}
      >
        {this.props.menuItems}
      </Popover>
    );
  }
}

export default withStyles<typeof BubblePopover>(styles)(BubblePopover);
