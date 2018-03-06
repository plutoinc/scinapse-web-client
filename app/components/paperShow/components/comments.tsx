import * as React from "react";
import { List } from "immutable";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ICommentRecord } from "../../../model/comment";
import PaperShowCommentItem from "./commentItem";
const styles = require("./comments.scss");

interface PaperShowCommentsProps {
  comments: List<ICommentRecord> | null;
}

function mapCommentsNode(comments: List<ICommentRecord>) {
  return comments.map((comment, index) => (
    <PaperShowCommentItem comment={comment} key={`paperShow_comment_${index}`} />
  ));
}

const PaperShowComments = (props: PaperShowCommentsProps) => {
  const { comments } = props;

  if (!comments) {
    return null;
  } else {
    return (
      <div className={styles.commentsBoxWrapper}>
        <div>comment Input Box</div>
        <div className={styles.commentListBox}>{mapCommentsNode(comments)}</div>
      </div>
    );
  }
};

export default withStyles<typeof PaperShowComments>(styles)(PaperShowComments);
