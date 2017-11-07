import * as React from "react";
import Icon from "../../../icons";
const styles = require("./note.scss");

interface IArticleNote {
  note?: string;
}

const ArticleNote = ({ note }: IArticleNote) => {
  if (!note) {
    return null;
  }

  return (
    <div className={styles.reviewNoteWrapper}>
      <div className={styles.noteIconWrapper}>
        <div className={styles.noteIconContent}>Note to reviewers</div>
        <Icon className={styles.noteIcon} icon="NOTE_TO_REVIEWER" />
      </div>
      <div className={styles.noteContent}>{note}</div>
    </div>
  );
};

export default ArticleNote;
