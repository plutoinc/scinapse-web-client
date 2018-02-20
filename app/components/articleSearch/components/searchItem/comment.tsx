import * as React from "react";
import { ICommentRecord } from "../../../../model/comment";
import { IconMenu, IconButton, MenuItem } from "material-ui";
import Icon from "../../../../icons";
import { withStyles } from "../../../../helpers/withStylesHelper";
const styles = require("./comment.scss");

export interface CommentProps {
  id: number;
  comment: ICommentRecord;
  isMine: boolean;
  deleteComment: () => void;
}

interface CommentState {
  isDeleteCommentLoading: boolean;
}

@withStyles<typeof Comment>(styles)
class Comment extends React.PureComponent<CommentProps, CommentState> {
  constructor(props: CommentProps) {
    super(props);

    this.state = {
      isDeleteCommentLoading: false,
    };
  }

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

  private handleDeleteComment = async () => {
    const { deleteComment } = this.props;

    if (confirm("Do you want to delete this comment?")) {
      this.setDeleteCommentLoading(true);
      await deleteComment();
      this.setDeleteCommentLoading(false);
    }
  };

  private setDeleteCommentLoading = (value: boolean) => {
    this.setState({
      isDeleteCommentLoading: value,
    });
  };

  private getCommentMoreItem = () => {
    const { isMine } = this.props;
    const { isDeleteCommentLoading } = this.state;

    const hasToShowCommentMoreItem = isMine && !isDeleteCommentLoading;
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
