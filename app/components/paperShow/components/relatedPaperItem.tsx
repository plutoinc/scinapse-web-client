import * as React from "react";
import * as store from "store";
import * as Cookies from "js-cookie";
import { Link, withRouter, RouteComponentProps } from "react-router-dom";
import * as classNames from "classnames";
import { withStyles } from "../../../helpers/withStylesHelper";
import { Paper } from "../../../model/paper";
import Icon from "../../../icons";
import { trackEvent } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { benefitSignUpTest, BENEFIT_EXPERIMENT_KEY, BenefitExp } from "../../../constants/abTest";
import { SESSION_ID_KEY } from "../../../constants/actionTicket";
import { checkAuth, AUTH_LEVEL } from "../../../helpers/checkAuthDialog";
const styles = require("./relatedPaperItem.scss");

const MAX_AUTHOR_COUNT_TO_SHOW = 2;

interface PaperShowRelatedPaperItemProps extends RouteComponentProps<any> {
  paper: Paper;
  actionArea: Scinapse.ActionTicket.ActionArea;
  disableVisitedColour?: boolean;
}

class PaperShowRelatedPaperItem extends React.PureComponent<PaperShowRelatedPaperItemProps> {
  public render() {
    const { paper, actionArea, disableVisitedColour } = this.props;

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
                  ActionTicketManager.trackTicket({
                    pageType: "paperShow",
                    actionType: "fire",
                    actionArea,
                    actionTag: "authorShow",
                    actionLabel: String(paper.id),
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

    const venue = paper.journal
      ? `${paper.journal.title} ${paper.journal.impactFactor ? `[IF: ${paper.journal.impactFactor.toFixed(2)}]` : ""}`
      : paper.conferenceInstance && paper.conferenceInstance.conferenceSeries
        ? `${paper.conferenceInstance.conferenceSeries.name}`
        : "";

    return (
      <div className={styles.paperItemWrapper}>
        <a
          onClick={this.trackClickTitle}
          className={classNames({
            [styles.title]: true,
            [styles.notVisitedTitle]: disableVisitedColour,
          })}
          href={`/papers/${paper.id}`}
        >
          {paper.title}
        </a>
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
                {`${venue}`}
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

  private trackClickTitle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { actionArea, paper, history } = this.props;

    e.preventDefault();

    if (Cookies.get(benefitSignUpTest.name) === "refPaperCountSession") {
      const currentSessionId = store.get(SESSION_ID_KEY);
      const exp: BenefitExp | undefined = store.get(BENEFIT_EXPERIMENT_KEY);
      if (!exp || exp.id !== currentSessionId) {
        store.set(BENEFIT_EXPERIMENT_KEY, {
          id: currentSessionId,
          count: 1,
        } as BenefitExp);
      } else {
        const nextCount = exp.count + 1;
        store.set(BENEFIT_EXPERIMENT_KEY, {
          id: currentSessionId,
          count: nextCount,
        } as BenefitExp);
        if (nextCount > 3) {
          store.set(BENEFIT_EXPERIMENT_KEY, {
            id: currentSessionId,
            count: 2,
          } as BenefitExp);
          const isVerified = checkAuth({ authLevel: AUTH_LEVEL.VERIFIED, actionArea, userActionType: "paperShow" });
          if (!isVerified) return;
        }
      }
    }

    trackEvent({
      category: "New Paper Show",
      action: "Click relatedPaperItem in sideNavigation",
      label: JSON.stringify({ referer: `paper_show_${actionArea}`, refererLocation: location.pathname }),
    });

    ActionTicketManager.trackTicket({
      pageType: "paperShow",
      actionType: "fire",
      actionArea,
      actionTag: "paperShow",
      actionLabel: String(paper.id),
    });

    history.push(`/papers/${paper.id}`);
  };
}

export default withRouter(withStyles<typeof PaperShowRelatedPaperItem>(styles)(PaperShowRelatedPaperItem));
