import * as React from "react";
import { Comment } from "../../../../model/comment";
import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import MenuItem from "@material-ui/core/MenuItem";
import Icon from "../../../../icons";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./comment.scss");

export interface CommentProps {
  id: number;
  comment: Comment;
  isMine: boolean;
  handleRemoveComment: (targetComment: Comment) => void;
}

export interface CommentItemStates
  extends Readonly<{
      isAdditionalMenuOpen: boolean;
    }> {}

@withStyles<typeof CommentItem>(styles)
class CommentItem extends React.PureComponent<CommentProps, CommentItemStates> {
  private additionalMenuAnchor: HTMLElement | null;

  public constructor(props: CommentProps) {
    super(props);

    this.state = {
      isAdditionalMenuOpen: false
    };
  }

  public render() {
    const { comment } = this.props;

    return (
      <div className={styles.comment}>
        <div className={styles.authorInfo}>
          <div className={styles.author}>{comment.createdBy!.name}</div>
          <div className={styles.institution}>
            {comment.createdBy!.affiliation}
          </div>
        </div>
        <div className={styles.commentContent}>{comment.comment}</div>
        {this.getCommentMoreItem()}
      </div>
    );
  }

  private handleDeleteComment = () => {
    const { comment, handleRemoveComment } = this.props;

    if (confirm("Do you want to delete this comment?")) {
      handleRemoveComment(comment);
      this.closeAdditionalMenu();
    }
  };

  private getCommentMoreItem = () => {
    const { isMine } = this.props;

    const hasToShowCommentMoreItem = isMine;
    if (hasToShowCommentMoreItem) {
      return (
        <div className={styles.additionalMenuWrapper}>
          <div
            className={styles.additionalMenuHiddenLayer}
            ref={el => (this.additionalMenuAnchor = el)}
          >
            <IconButton
              onClick={this.openAdditionalMenu}
              classes={{ root: styles.additionalMenuIcon }}
            >
              <Icon
                className={styles.commentMoreItemButton}
                icon="COMMENT_MORE_ITEM"
              />
            </IconButton>
            <Popover
              anchorEl={this.additionalMenuAnchor!}
              open={this.state.isAdditionalMenuOpen}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              onClose={this.closeAdditionalMenu}
            >
              <MenuItem
                onClick={this.handleDeleteComment}
                classes={{ root: styles.menuItem }}
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
      isAdditionalMenuOpen: true
    });
  };

  private closeAdditionalMenu = () => {
    this.setState({
      isAdditionalMenuOpen: false
    });
  };
}

export default CommentItem;
