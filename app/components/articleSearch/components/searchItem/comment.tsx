import * as React from "react";
import { ICommentRecord } from "../../../../model/comment";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import Icon from "../../../../icons";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./comment.scss");

export interface CommentProps {
  id: number;
  comment: ICommentRecord;
  isMine: boolean;
  handleRemoveComment: (targetComment: ICommentRecord) => void;
}

@withStyles<typeof Comment>(styles)
class Comment extends React.PureComponent<CommentProps, {}> {
  public render() {
    const { comment } = this.props;

    return (
      <div className={styles.comment}>
        <div className={styles.authorInfo}>
          <div className={styles.author}>{comment.createdBy.name}</div>
          <div className={styles.institution}>{comment.createdBy.affiliation}</div>
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
    }
  };

  private getCommentMoreItem = () => {
    const { isMine } = this.props;

    const hasToShowCommentMoreItem = isMine;
    if (hasToShowCommentMoreItem) {
      return (
        <div className={styles.reviewMoreItemWrapper}>
          <IconMenu
            iconButtonElement={
              <IconButton style={{ width: "inherit", height: "inherit", padding: "0", margin: "0" }}>
                <Icon className={styles.commentMoreItemButton} icon="COMMENT_MORE_ITEM" />
              </IconButton>
            }
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            targetOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={this.handleDeleteComment}
              style={{
                color: "#f54b5e",
              }}
              primaryText="Delete"
            />
          </IconMenu>
        </div>
      );
    }
  };
}

export default Comment;
