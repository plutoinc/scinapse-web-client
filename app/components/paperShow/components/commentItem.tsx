import * as React from "react";
import { withStyles } from "../../../helpers/withStylesHelper";
import { CommentRecord } from "../../../model/comment";
import IconMenu from "material-ui/IconMenu";
import IconButton from "material-ui/IconButton";
import MenuItem from "material-ui/MenuItem";
import Icon from "../../../icons";
import { CurrentUserRecord } from "../../../model/currentUser";
const styles = require("./commentItem.scss");

interface PaperShowCommentItemProps {
  currentUser: CurrentUserRecord;
  comment: CommentRecord;
  handleDeleteComment: (comment: CommentRecord) => void;
}

function getMoreButton(props: PaperShowCommentItemProps) {
  if (!props.currentUser.isLoggedIn || props.comment.createdBy!.id !== props.currentUser.id) {
    return null;
  } else {
    return (
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
            props.handleDeleteComment(props.comment);
          }}
          style={{
            color: "#f54b5e",
          }}
          primaryText="Delete"
        />
      </IconMenu>
    );
  }
}

const PaperShowCommentItem = (props: PaperShowCommentItemProps) => {
  return (
    <div className={styles.commentItemWrapper}>
      <div className={styles.authorInformationBox}>
        <span className={styles.authorName}>{props.comment.createdBy!.name}</span>
        <span className={styles.authorAffiliation}>{props.comment.createdBy!.affiliation}</span>
        {getMoreButton(props)}
      </div>
      <div className={styles.contentBox}>{props.comment.comment}</div>
    </div>
  );
};

export default withStyles<typeof PaperShowCommentItem>(styles)(PaperShowCommentItem);
