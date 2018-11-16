import * as React from "react";
// import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperAuthor } from "../../../model/author";
// import { trackEvent } from "../../../helpers/handleGA";
const styles = require("./author.scss");

interface PostAuthorProps {
  author: PaperAuthor;
}

function getOrganization(organization: string) {
  if (!organization) {
    return null;
  } else {
    return <div className={styles.authorAffiliation}>{organization}</div>;
  }
}

const PostAuthor = ({ author }: PostAuthorProps) => {
  return (
    <div className={styles.authorItemWrapper}>
      <div className={styles.authorBasic}>
        <div className={styles.authorName}>{author.name}</div>
        {getOrganization(author.organization)}
      </div>
      <div className={styles.authorHindex}>
        <span className={styles.authorHindexLabel}>H-Index: </span>
        <span className={styles.authorHindexValue}>{author.hindex}</span>
      </div>
    </div>
  );
};

export default withStyles<typeof PostAuthor>(styles)(PostAuthor);
