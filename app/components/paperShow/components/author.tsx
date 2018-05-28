import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import HIndexBox from "../../common/hIndexBox";
import { PaperAuthor } from "../../../model/author";
const styles = require("./author.scss");

interface PostAuthorProps {
  author: PaperAuthor;
}

function getOrganization(organization: string) {
  if (!organization) {
    return null;
  } else {
    return <div className={styles.organization}>{organization}</div>;
  }
}

const PostAuthor = ({ author }: PostAuthorProps) => {
  return (
    <Link to={`/authors/${author.id}`} className={styles.authorWrapper}>
      <span className={styles.name}>{author.name}</span>
      {getOrganization(author.organization)}
      <div className={styles.hindexWrapper}>
        <HIndexBox hIndex={author.hindex} />
      </div>
    </Link>
  );
};

export default withStyles<typeof PostAuthor>(styles)(PostAuthor);
