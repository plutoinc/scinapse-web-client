import * as React from "react";
import { IPaperCommentRecord } from "../../../../model/paperComment";
import { IconMenu, IconButton, MenuItem } from "material-ui";
import Icon from "../../../../icons";

const styles = require("./comment.scss");

export interface ICommentProps {
  id: number;
  comment: IPaperCommentRecord;
  isMine: Boolean;
  deleteComment: (id: number) => void;
}

interface ICommentState {
  isDeleteCommentLoading: boolean;
}

class Comment extends React.PureComponent<ICommentProps, ICommentState> {
  constructor(props: ICommentProps) {
    super(props);

    this.state = {
      isDeleteCommentLoading: false,
    };
  }

  private getCommentMoreItem = () => {
    const { id, deleteComment, isMine } = this.props;
    const { isDeleteCommentLoading } = this.state;

    if (isMine && !isDeleteCommentLoading) {
      return (
        <div className={styles.reviewMoreItemWrapper}>
          <IconMenu
            iconButtonElement={
              <IconButton style={{ width: "inherit", height: "inherit", padding: "0", margin: "0" }}>
                <Icon className={styles.commentMoreItemButton} icon="REVIEW_MORE_ITEM" />
              </IconButton>
            }
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            targetOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={async () => {
                if (confirm("Do you want to delete this comment?")) {
                  this.setState({
                    isDeleteCommentLoading: true,
                  });
                  await deleteComment(id);
                  this.setState({
                    isDeleteCommentLoading: false,
                  });
                }
              }}
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

  public render() {
    const { comment } = this.props;

    return (
      <div className={styles.comment}>
        <div className={styles.authorInfo}>
          <div className={styles.author}>{comment.createdBy.name}</div>
          <div className={styles.institution}>{comment.createdBy.institution}</div>
        </div>
        <div className={styles.commentContent}>{comment.comment}</div>
        {this.getCommentMoreItem()}
      </div>
    );
  }
}

export default Comment;
