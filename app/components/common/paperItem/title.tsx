import * as React from "react";
import * as store from "store";
import * as Cookies from "js-cookie";
import { escapeRegExp } from "lodash";
import { withRouter, RouteComponentProps } from "react-router-dom";
import HighLightedContent from "../highLightedContent";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
import { formulaeToHTMLStr } from "../../../helpers/displayFormula";
import actionTicketManager from "../../../helpers/actionTicketManager";
import { SESSION_ID_KEY } from "../../../constants/actionTicket";
import { BenefitExp, BENEFIT_EXPERIMENT_KEY, benefitSignUpTest } from "../../../constants/abTest";
import GlobalDialogManager from "../../../helpers/globalDialogManager";
const styles = require("./title.scss");

export interface TitleProps extends RouteComponentProps<any> {
  title: string;
  paperId: number;
  source: string;
  pageType: Scinapse.ActionTicket.PageType;
  shouldBlockUnsignedUser: boolean;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  searchQueryText?: string;
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
    const { pageType, actionArea, paperId, shouldBlockUnsignedUser, history } = this.props;

    e.preventDefault();

    const currentSessionId = store.get(SESSION_ID_KEY);
    const exp: BenefitExp | undefined = store.get(BENEFIT_EXPERIMENT_KEY);
    if (shouldBlockUnsignedUser && Cookies.get(benefitSignUpTest.name) === "refPaperCountSession") {
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
          return GlobalDialogManager.openSignUpDialog({
            userActionType: "paperShow",
            actionArea,
          });
        }
      }
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
