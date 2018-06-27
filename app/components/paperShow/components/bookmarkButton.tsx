import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./bookmarkButton.scss");

interface PaperShowBookmarkButtonProps {
  isBookmarked: boolean;
  toggleBookmark: () => void;
}

class PaperShowBookmarkButton extends React.PureComponent<
  PaperShowBookmarkButtonProps,
  {}
> {
  public render() {
    if (this.props.isBookmarked) {
      return (
        <div
          className={styles.bookmarkIconWrapper}
          onClick={this.props.toggleBookmark}
        >
          <Icon className={styles.bookmarkIcon} icon="BOOKMARK_REMOVE" />
          <span>REMOVE</span>
        </div>
      );
    } else {
      return (
        <div
          className={styles.bookmarkIconWrapper}
          onClick={this.props.toggleBookmark}
        >
          <Icon className={styles.bookmarkIcon} icon="BOOKMARK_GRAY" />
          <span>BOOKMARK</span>
        </div>
      );
    }
  }
}

export default withStyles<typeof PaperShowBookmarkButton>(styles)(
  PaperShowBookmarkButton
);
