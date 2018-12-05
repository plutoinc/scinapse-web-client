import * as React from "react";
import Popover from "@material-ui/core/Popover";
import { PopoverProps } from "@material-ui/core/Popover";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./bubblePopover.scss");

interface BubblePopoverProps extends PopoverProps {}

class BubblePopover extends React.PureComponent<BubblePopoverProps> {
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
        {this.props.children}
      </Popover>
    );
  }
}

export default withStyles<typeof BubblePopover>(styles)(BubblePopover);
