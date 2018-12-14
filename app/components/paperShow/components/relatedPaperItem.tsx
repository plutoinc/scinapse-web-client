import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
import EnvChecker from "../../../helpers/envChecker";
const styles = require("./relatedPaperItem.scss");

const MAX_AUTHOR_COUNT_TO_SHOW = 2;

interface PaperShowRelatedPaperItemProps {
  paper: Paper;
  refererSection: string;
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
              <Link
                onClick={() => {
                  trackEvent({
                    category: "Flow to Author Show",
                    action: "Click Author",
                    label: "",
                  });
                }}
                className={styles.authorLink}
                to={`/authors/${author.id}`}
              >
                {author.name}
              </Link>
              <span>{author.organization ? `(${author.organization})` : ""}</span>
              <span>
                {paper.authors.length > MAX_AUTHOR_COUNT_TO_SHOW - 1 && index !== MAX_AUTHOR_COUNT_TO_SHOW - 1
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

    return (
      <div className={styles.paperItemWrapper}>
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
          }}
          onClick={this.trackClickTitle}
          className={styles.title}
        >
          {paper.title}
        </Link>
        <div className={styles.description}>
          {paper.journal ? (
            <div className={styles.journal}>
              <Icon icon="JOURNAL" />
              <Link
                to={`/journals/${paper.journal.id}`}
                onClick={() => {
                  trackEvent({ category: "Search", action: "Click Journal", label: "" });
                }}
                className={styles.journalLink}
              >
                {`${journal}`}
              </Link>
            </div>
          ) : null}

          {paper.authors.length ? (
            <div className={styles.author}>
              <Icon icon="AUTHOR" />
              <span>{authorNames}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  private trackClickTitle = () => {
    const { refererSection } = this.props;

    if (!EnvChecker.isOnServer()) {
      trackEvent({
        category: "New Paper Show",
        action: "Click relatedPaperItem in sideNavigation",
        label: JSON.stringify({ referer: `paper_show_${refererSection}`, refererLocation: location.pathname }),
      });
    }
  };
}

export default withStyles<typeof PaperShowRelatedPaperItem>(styles)(PaperShowRelatedPaperItem);
