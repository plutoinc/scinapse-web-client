import * as React from "react";
import { Link } from "react-router-dom";
import { stringify } from "qs";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperRecord } from "../../../model/paper";
import { PaperShowPageQueryParams } from "..";
const styles = require("./relatedPaperItem.scss");

const MAX_AUTHOR_COUNT_TO_SHOW = 2;

interface PaperShowRelatedPaperItemProps {
  paper: PaperRecord;
}

class PaperShowRelatedPaperItem extends React.PureComponent<PaperShowRelatedPaperItemProps, {}> {
  public render() {
    const { paper } = this.props;
    const authorNames =
      paper.authors &&
      paper.authors.slice(0, MAX_AUTHOR_COUNT_TO_SHOW).map((author, index) => {
        return (
          <React.Fragment key={`related_paper_${author.name}_${index}`}>
            <span>{author.name}</span>
            <span>{author.organization ? `(${author.organization})` : ""}</span>
            <span>
              {paper.authors.count() > MAX_AUTHOR_COUNT_TO_SHOW - 1 && index !== MAX_AUTHOR_COUNT_TO_SHOW - 1
                ? ", "
                : ""}
            </span>
          </React.Fragment>
        );
      });

    const journal = paper.journal
      ? `${paper.journal.fullTitle || paper.venue} [IF: ${
          paper.journal.impactFactor ? paper.journal.impactFactor : "?"
        }]`
      : "";

    const queryParams: PaperShowPageQueryParams = { "ref-page": 1, "cited-page": 1 };
    const stringifiedQueryParams = stringify(queryParams, { addQueryPrefix: true });

    return (
      <div className={styles.paperItemWrapper}>
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
            search: stringifiedQueryParams,
          }}
          className={styles.title}
        >
          {paper.title}
        </Link>
        <div className={styles.description}>
          <div>{journal}</div>
          <div>{authorNames}</div>
        </div>
      </div>
    );
  }
}

export default withStyles<typeof PaperShowRelatedPaperItem>(styles)(PaperShowRelatedPaperItem);
