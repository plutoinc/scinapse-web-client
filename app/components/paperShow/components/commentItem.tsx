import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Comment } from "../../../model/comment";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "../../../icons";
import { CurrentUser } from "../../../model/currentUser";
const styles = require("./commentItem.scss");

interface PaperShowCommentItemProps {
  currentUser: CurrentUser;
  comment: Comment;
  handleDeleteComment: (comment: Comment) => void;
}

interface PaperShowCommentItemStates
  extends Readonly<{
      isAdditionalMenuOpen: boolean;
    }> {}

class PaperShowCommentItem extends React.PureComponent<PaperShowCommentItemProps, PaperShowCommentItemStates> {
  private additionalMenuAnchor: HTMLElement | null;

  public constructor(props: PaperShowCommentItemProps) {
    super(props);

    this.state = {
      isAdditionalMenuOpen: false,
    };
  }

  public render() {
    const { comment } = this.props;

    return (
      <div className={styles.commentItemWrapper}>
        <div className={styles.authorInformationBox}>
          <span className={styles.authorName}>{`${comment.createdBy.firstName} ${comment.createdBy.lastName ||
            ""}`}</span>
          <span className={styles.authorAffiliation}>{comment.createdBy.affiliation}</span>
          {this.getMoreButton()}
        </div>
        <div className={styles.contentBox}>{comment.comment}</div>
      </div>
    );
  }

  private getMoreButton = () => {
    if (!this.props.currentUser.isLoggedIn || this.props.comment.createdBy!.id !== this.props.currentUser.id) {
      return null;
    } else {
      return (
        <div className={styles.commentMoreItemWrapper}>
          <div ref={el => (this.additionalMenuAnchor = el)}>
            <IconButton onClick={this.openAdditionalMenu} classes={{ root: styles.commentMoreItem }}>
              <Icon className={styles.commentMoreIcon} icon="COMMENT_MORE_ITEM" />
            </IconButton>
            <Popover
              anchorEl={this.additionalMenuAnchor!}
              open={this.state.isAdditionalMenuOpen}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              onClose={this.closeAdditionalMenu}
            >
              <MenuItem
                onClick={() => {
                  this.props.handleDeleteComment(this.props.comment);
                  this.closeAdditionalMenu();
                }}
                classes={{ root: styles.additionalMenuItem }}
              >
                Delete
              </MenuItem>
            </Popover>
          </div>
        </div>
      );
    }
  };

  private openAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: true,
    });
  };

  private closeAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: false,
    });
  };
}

export default withStyles<typeof PaperShowCommentItem>(styles)(PaperShowCommentItem);
