import * as React from "react";
import * as classNames from "classnames";
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
    return (
      <div
        className={classNames({
          [`${styles.bookmarkIconWrapper}`]: true,
          [`${styles.active}`]: this.props.isBookmarked
        })}
        onClick={this.props.toggleBookmark}
      >
        <Icon className={styles.bookmarkIcon} icon="BOOKMARK_GRAY" />
        <span>BOOKMARK</span>
      </div>
    );
  }
}

export default withStyles<typeof PaperShowBookmarkButton>(styles)(
  PaperShowBookmarkButton
);
