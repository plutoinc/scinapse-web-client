import * as React from "react";
import { AuthorRecord } from "../../../model/author";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./author.scss");

interface PostAuthorProps {
  author: AuthorRecord;
}

function getOrganization(organization: string) {
  if (!organization) {
    return null;
  } else {
    return <div className={styles.organization}>{` (${organization})`}</div>;
  }
}

const PostAuthor = ({ author }: PostAuthorProps) => {
  return (
    <span className={styles.authorWrapper}>
      <span className={styles.name}>{author.name}</span>
      <span className={styles.hIndexBox}>{`H-index : ${author.hindex || "?"}`}</span>
      {getOrganization(author.organization)}
    </span>
  );
};

export default withStyles<typeof PostAuthor>(styles)(PostAuthor);
