import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Comment } from "../../../model/comment";
import PaperShowCommentItem from "./commentItem";
import DesktopPagination from "../../common/desktopPagination";
import MobilePagination from "../../common/mobilePagination";
import ArticleSpinner from "../../common/spinner/articleSpinner";
import { CurrentUser } from "../../../model/currentUser";
import { Paper } from "../../../model/paper";
const styles = require("./comments.scss");

interface PaperShowCommentsProps {
  paper: Paper;
  isMobile: boolean;
  comments: Comment[];
  currentUser: CurrentUser;
  isFetchingComments: boolean;
  currentPageIndex: number;
  commentTotalPage: number;
  fetchComments: (pageIndex: number) => void;
  handleDeleteComment: (comment: Comment) => void;
}

class PaperShowComments extends React.PureComponent<PaperShowCommentsProps> {
  public render() {
    const { comments } = this.props;

    if (!comments) {
      return null;
    } else {
      return (
        <div className={styles.commentsBoxWrapper}>
          {this.getCommentsNode()}
          {this.getPagination()}
        </div>
      );
    }
  }

  private getPagination = () => {
    const { isMobile, fetchComments, commentTotalPage, currentPageIndex } = this.props;

    if (isMobile) {
      return (
        <MobilePagination
          totalPageCount={commentTotalPage}
          currentPageIndex={currentPageIndex}
          onItemClick={fetchComments}
          wrapperStyle={{
            margin: "12px 0",
          }}
        />
      );
    } else {
      return (
        <DesktopPagination
          type="paper_show_comment"
          totalPage={this.props.commentTotalPage}
          currentPageIndex={this.props.currentPageIndex}
          onItemClick={fetchComments}
          wrapperStyle={{
            margin: "24px 0",
          }}
        />
      );
    }
  };

  private mapCommentsNode = (comments: Comment[]) => {
    return comments.map((comment, index) => (
      <PaperShowCommentItem
        currentUser={this.props.currentUser}
        comment={comment!}
        handleDeleteComment={this.props.handleDeleteComment}
        key={`paperShow_comment_${index}`}
      />
    ));
  };

  private getCommentsNode = () => {
    const { isFetchingComments, comments } = this.props;

    if (isFetchingComments) {
      return (
        <div className={styles.commentListBox}>
          <ArticleSpinner style={{ margin: "200px auto" }} />
        </div>
      );
    } else {
      return <div className={styles.commentListBox}>{this.mapCommentsNode(comments)}</div>;
    }
  };
}

export default withStyles<typeof PaperShowComments>(styles)(PaperShowComments);
