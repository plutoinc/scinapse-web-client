import * as React from "react";
import { IAuthorRecord } from "../../../model/author";
import { withStyles } from "../../../helpers/withStylesHelper";
import Tooltip from "../../common/tooltip/tooltip";
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

function getHIndexTooltip(hIndex: number) {
  if (!!hIndex) {
    return (
      <span className={styles.authorHIndex}>
        <Tooltip
          className={styles.authorHIndexTooltip}
          left={-57}
          top={-42}
          iconTop={-9}
          content={`Estimated H-index: ${hIndex}`}
          type="h-index"
        />
        {hIndex}
      </span>
    );
  }
}

const PostAuthor = ({ author }: PostAuthorProps) => {
  return (
    <span className={styles.authorWrapper}>
      <span className={styles.name}>{author.name}</span>
      {getHIndexTooltip(author.hindex)}
      {getOrganization(author.organization)}
    </span>
  );
};

export default withStyles<typeof PostAuthor>(styles)(PostAuthor);
