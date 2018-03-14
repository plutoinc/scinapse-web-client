import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { ICommentRecord } from "../../../model/comment";
import { IconMenu, IconButton, MenuItem } from "material-ui";
import Icon from "../../../icons";
import { CurrentUserRecord } from "../../../model/currentUser";
const styles = require("./commentItem.scss");

interface PaperShowCommentItemProps {
  currentUser: CurrentUserRecord;
  comment: ICommentRecord;
  handleDeleteComment: (comment: ICommentRecord) => void;
}

const PaperShowCommentItem = ({ comment, handleDeleteComment }: PaperShowCommentItemProps) => {
  return (
    <div className={styles.commentItemWrapper}>
      <div className={styles.authorInformationBox}>
        <span className={styles.authorName}>{comment.createdBy.name}</span>
        <span className={styles.authorAffiliation}>{comment.createdBy.affiliation}</span>
        <IconMenu
          style={{ position: "absolute", right: "30px", top: 0, bottom: 0 }}
          iconButtonElement={
            <IconButton style={{ width: "inherit", height: "inherit", padding: "0", margin: "0" }}>
              <Icon className={styles.commentMoreItemButton} icon="COMMENT_MORE_ITEM" />
            </IconButton>
          }
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          targetOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              handleDeleteComment(comment);
            }}
            style={{
              color: "#f54b5e",
            }}
            primaryText="Delete"
          />
        </IconMenu>
      </div>
      <div className={styles.contentBox}>{comment.comment}</div>
    </div>
  );
};

export default withStyles<typeof PaperShowCommentItem>(styles)(PaperShowCommentItem);
