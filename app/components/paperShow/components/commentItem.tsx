import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ICommentRecord } from "../../../model/comment";
const styles = require("./commentItem.scss");

interface PaperShowCommentItemProps {
  comment: ICommentRecord;
}

const PaperShowCommentItem = ({ comment }: PaperShowCommentItemProps) => {
  return (
    <div className={styles.commentItemWrapper}>
      <div className={styles.authorInformationBox}>
        <span className={styles.authorName}>{comment.createdBy.name}</span>
        <span className={styles.authorAffiliation}>{comment.createdBy.affiliation}</span>
      </div>
      <div className={styles.contentBox}>{comment.comment}</div>
    </div>
  );
};

export default withStyles<typeof PaperShowCommentItem>(styles)(PaperShowCommentItem);
