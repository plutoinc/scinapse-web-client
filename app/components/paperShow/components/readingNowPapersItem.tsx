import * as React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
import EnvChecker from "../../../helpers/envChecker";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const styles = require("./readingNowPapersItem.scss");

const MAX_LENGTH_OF_AUTHOR = 90;

interface PaperShowReadingNowPapersItemProps {
  paper: Paper;
  actionArea: Scinapse.ActionTicket.ActionArea;
}

class PaperShowReadingNowPapersItem extends React.PureComponent<PaperShowReadingNowPapersItemProps> {
  public render() {
    const { paper, actionArea } = this.props;

    const journal = paper.journal
      ? `${paper.journal.title || paper.venue} ${
          paper.journal.impactFactor ? `[IF: ${paper.journal.impactFactor.toFixed(2)}]` : ""
        }`
      : "";

    let finalTitle;
    const paperTitle = paper.title;

    if (paperTitle.length > MAX_LENGTH_OF_AUTHOR) {
      finalTitle = paperTitle.slice(0, MAX_LENGTH_OF_AUTHOR) + "...";
    } else {
      finalTitle = paperTitle;
    }

    return (
      <div className={styles.paperItemWrapper}>
        <Link
          to={{
            pathname: `/papers/${paper.id}`,
          }}
          onClick={this.trackClickTitle}
          className={styles.title}
        >
          {finalTitle}
        </Link>
        <div className={styles.description}>
          {paper.journal ? (
            <div className={styles.journal}>
              <Icon icon="JOURNAL" />
              <Link
                to={`/journals/${paper.journal.id}`}
                onClick={() => {
                  trackEvent({ category: "Search", action: "Click Journal", label: "" });
                  ActionTicketManager.trackTicket({
                    pageType: "paperShow",
                    actionType: "fire",
                    actionArea,
                    actionTag: "journalShow",
                    actionLabel: String(paper.id),
                  });
                }}
                className={styles.journalLink}
              >
                {`${paper.year} ${journal}`}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  private trackClickTitle = () => {
    const { actionArea, paper } = this.props;

    if (!EnvChecker.isOnServer()) {
      trackEvent({
        category: "New Paper Show",
        action: "Click readingNowPaperItem in sideNavigation",
        label: JSON.stringify({ referer: `paper_show_${actionArea}`, refererLocation: location.pathname }),
      });

      ActionTicketManager.trackTicket({
        pageType: "paperShow",
        actionType: "fire",
        actionArea,
        actionTag: "paperShow",
        actionLabel: String(paper.id),
      });
    }
  };
}

export default withStyles<typeof PaperShowReadingNowPapersItem>(styles)(PaperShowReadingNowPapersItem);
