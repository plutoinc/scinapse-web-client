import * as React from "react";
import { List } from "immutable";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ICommentRecord } from "../../../model/comment";
import PaperShowCommentItem from "./commentItem";
import CommonPagination from "../../common/commonPagination";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import { CurrentUserRecord } from "../../../model/currentUser";
const styles = require("./comments.scss");

interface PaperShowCommentsProps {
  comments: List<ICommentRecord> | null;
  currentUser: CurrentUserRecord;
  isFetchingComments: boolean;
  currentCommentPage: number;
  commentTotalPage: number;
  fetchComments: (pageIndex: number) => void;
  handleDeleteComment: (comment: ICommentRecord) => void;
}

class PaperShowComments extends React.PureComponent<PaperShowCommentsProps, {}> {
  public render() {
    const { comments, fetchComments } = this.props;

    if (!comments) {
      return null;
    } else {
      return (
        <div className={styles.commentsBoxWrapper}>
          {this.getCommentsNode()}
          <CommonPagination
            type="paper_show_comment"
            totalPage={this.props.commentTotalPage}
            currentPageIndex={this.props.currentCommentPage}
            onItemClick={fetchComments}
            wrapperStyle={{
              margin: "24px 0",
            }}
          />
        </div>
      );
    }
  }

  private mapCommentsNode = (comments: List<ICommentRecord>) => {
    return comments.map((comment, index) => (
      <PaperShowCommentItem
        currentUser={this.props.currentUser}
        comment={comment}
        handleDeleteComment={this.props.handleDeleteComment}
        key={`paperShow_comment_${index}`}
      />
    ));
  };

  private getCommentsNode = () => {
    if (this.props.isFetchingComments) {
      return (
        <div className={styles.commentListBox}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    } else {
      return <div className={styles.commentListBox}>{this.mapCommentsNode(this.props.comments)}</div>;
    }
  };
}

export default withStyles<typeof PaperShowComments>(styles)(PaperShowComments);
