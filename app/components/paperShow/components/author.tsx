import * as React from "react";
import { Link } from "react-router-dom";
import { PaperAuthorRecord } from "../../../model/author";
import { withStyles } from "../../../helpers/withStylesHelper";
import HIndexBox from "../../common/hIndexBox";
const styles = require("./author.scss");

interface PostAuthorProps {
  author: PaperAuthorRecord;
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
      <Link to={`/authors/${author.id}`} className={styles.name}>
        {author.name}
      </Link>
      <HIndexBox hIndex={author.hindex} />
      {getOrganization(author.organization)}
    </span>
  );
};

export default withStyles<typeof PostAuthor>(styles)(PostAuthor);
