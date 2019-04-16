import * as React from "react";
import { escapeRegExp } from "lodash";
import { withRouter, RouteComponentProps } from "react-router-dom";
import HighLightedContent from "../highLightedContent";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
import { formulaeToHTMLStr } from "../../../helpers/displayFormula";
import actionTicketManager from "../../../helpers/actionTicketManager";
import { checkBenefitExp } from "../../../helpers/checkBenefitExpCount";
const styles = require("./title.scss");

export interface TitleProps extends RouteComponentProps<any> {
  title: string;
  paperId: number;
  source: string;
  pageType: Scinapse.ActionTicket.PageType;
  shouldBlockUnverifiedUser: boolean;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  searchQueryText?: string;
  currentPage?: number;
}

class Title extends React.PureComponent<TitleProps, {}> {
  public render() {
    const { title, paperId, searchQueryText, source } = this.props;

    if (!title) {
      return null;
    }
    // for removing first or last space or trash value of content
    const trimmedTitle = title
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    const noSearchQueryText = !searchQueryText;
    const searchQuery = escapeRegExp(searchQueryText);
    if (noSearchQueryText) {
      return (
        <div>
          <a href={`/papers/${paperId}`} onClick={this.handleClickTitle} className={styles.title}>
            <span dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(title) }} />
          </a>
        </div>
      );
    }
    return (
      <div>
        <HighLightedContent
          content={trimmedTitle}
          highLightContent={searchQuery}
          className={styles.title}
          onClickFunc={this.handleClickTitle}
          href={source}
          to={{
            pathname: `/papers/${paperId}`,
          }}
        />
      </div>
    );
  }

  private handleClickTitle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { pageType, actionArea, paperId, shouldBlockUnverifiedUser, history, currentPage } = this.props;

    e.preventDefault();

    if (shouldBlockUnverifiedUser) {
      const isBlocked = checkBenefitExp({
        type: "refPaperCountSession",
        matching: "session",
        maxCount: 3,
        actionArea: actionArea!,
        userActionType: "paperShow",
        expName: "refPaperCountSession",
      });

      if (isBlocked) return;
    }

    if (currentPage === 1) {
      const isBlocked = checkBenefitExp({
        type: "getFromFirstResultPage",
        matching: "device",
        maxCount: 3,
        actionArea: "searchResult",
        userActionType: "paperShow",
        expName: "getFromFirstResultPage",
      });

      if (isBlocked) return;
    }

    actionTicketManager.trackTicket({
      pageType,
      actionType: "fire",
      actionArea: actionArea || pageType,
      actionTag: "paperShow",
      actionLabel: String(paperId),
    });

    trackEvent({
      category: "Flow to Paper Show",
      action: "Click Title",
      label: JSON.stringify({ referer: pageType, refererLocation: location.pathname }),
    });

    history.push(`/papers/${paperId}`);
  };
}

export default withRouter(withStyles<typeof Title>(styles)(Title));
