import * as React from "react";
import { Link } from "react-router-dom";
import { stringify } from "qs";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperRecord } from "../../../model/paper";
import { PaperShowPageQueryParams } from "..";
import PapersQueryFormatter from "../../../helpers/papersQueryFormatter";
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
        if (author) {
          return (
            <React.Fragment key={`related_paper_${author.id}_${index}`}>
              <Link className={styles.authorLink} to={`/authors/${author.id}`}>
                {author.name}
              </Link>
              <span>{author.organization ? `(${author.organization})` : ""}</span>
              <span>
                {paper.authors.count() > MAX_AUTHOR_COUNT_TO_SHOW - 1 && index !== MAX_AUTHOR_COUNT_TO_SHOW - 1
                  ? ", "
                  : ""}
              </span>
            </React.Fragment>
          );
        }
      });

    const journal = paper.journal
      ? `${paper.journal.fullTitle || paper.venue} ${
          paper.journal.impactFactor ? `[IF: ${paper.journal.impactFactor.toFixed(2)}]` : ""
        }`
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
          <Link
            className={styles.journalLink}
            to={{
              pathname: "/search",
              search: PapersQueryFormatter.stringifyPapersQuery({
                query: paper.journal ? paper.journal.fullTitle || paper.venue : "",
                sort: "RELEVANCE",
                page: 1,
                filter: {},
              }),
            }}
          >
            {journal}
          </Link>
          <div>{authorNames}</div>
        </div>
      </div>
    );
  }
}

export default withStyles<typeof PaperShowRelatedPaperItem>(styles)(PaperShowRelatedPaperItem);
