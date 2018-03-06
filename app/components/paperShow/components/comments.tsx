import * as React from "react";
import { List } from "immutable";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ICommentRecord } from "../../../model/comment";
import PaperShowCommentInput, { PaperShowCommentInputProps } from "./commentInput";
import PaperShowCommentItem from "./commentItem";
import CommonPagination from "../../common/commonPagination";
import ArticleSpinner from "../../common/spinner/articleSpinner";
const styles = require("./comments.scss");

interface PaperShowCommentsProps extends PaperShowCommentInputProps {
  comments: List<ICommentRecord> | null;
  isFetchingComments: boolean;
  currentCommentPage: number;
  commentTotalPage: number;
  fetchComments: (pageIndex: number) => void;
}

function mapCommentsNode(comments: List<ICommentRecord>) {
  return comments.map((comment, index) => (
    <PaperShowCommentItem comment={comment} key={`paperShow_comment_${index}`} />
  ));
}

function getCommentsNode(props: PaperShowCommentsProps) {
  if (props.isFetchingComments) {
    return (
      <div className={styles.commentListBox}>
        <ArticleSpinner style={{ margin: "200px auto" }} />
      </div>
    );
  } else {
    return <div className={styles.commentListBox}>{mapCommentsNode(props.comments)}</div>;
  }
}

const PaperShowComments = (props: PaperShowCommentsProps) => {
  const {
    comments,
    handleChangeCommentInput,
    handlePostComment,
    commentInput,
    isPostingComment,
    isFailedToPostingComment,
    fetchComments,
  } = props;

  if (!comments) {
    return null;
  } else {
    return (
      <div className={styles.commentsBoxWrapper}>
        <div className={styles.commentTitle}>
          <span>Comments</span>
          <span className={styles.commentCount}>{comments.size}</span>
        </div>
        <PaperShowCommentInput
          commentInput={commentInput}
          isPostingComment={isPostingComment}
          isFailedToPostingComment={isFailedToPostingComment}
          handlePostComment={handlePostComment}
          handleChangeCommentInput={handleChangeCommentInput}
        />
        {getCommentsNode(props)}
        <CommonPagination
          type="paper_show_comment"
          totalPage={props.commentTotalPage}
          currentPageIndex={props.currentCommentPage}
          onItemClick={fetchComments}
          wrapperStyle={{
            margin: "24px 0",
          }}
        />
      </div>
    );
  }
};

export default withStyles<typeof PaperShowComments>(styles)(PaperShowComments);
