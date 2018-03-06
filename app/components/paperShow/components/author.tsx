import * as React from "react";
import { IAuthorRecord } from "../../../model/author";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./author.scss");

interface PostAuthorProps {
  author: IAuthorRecord;
}

function getOrganization(organization: string) {
  if (!organization) {
    return null;
  } else {
    return <span className={styles.organization}>{` (${organization})`}</span>;
  }
}

const PostAuthor = ({ author }: PostAuthorProps) => {
  return (
    <span className={styles.authorWrapper}>
      <span className={styles.name}>{author.name}</span>
      {getOrganization(author.organization)}
    </span>
  );
};

export default withStyles<typeof PostAuthor>(styles)(PostAuthor);
