import * as React from "react";
import { escapeRegExp } from "lodash";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import HighLightedContent from "../highLightedContent";
import { withStyles } from "../../../helpers/withStylesHelper";
import { formulaeToHTMLStr } from "../../../helpers/displayFormula";
import actionTicketManager from "../../../helpers/actionTicketManager";
import { getUserGroupName } from "../../../helpers/abTestHelper";
import { getCurrentPageType } from "../../locationListener";
import { Paper } from "../../../model/paper";
import { PAPER_FROM_SEARCH_TEST_NAME } from "../../../constants/abTestGlobalValue";
import { getBlockedValueForPaperFromSearchTest } from "../../../helpers/abTestHelper/paperFromSearchTestHelper";
import { ActionCreators } from "../../../actions/actionTypes";
const styles = require("./title.scss");

export interface TitleProps extends RouteComponentProps<any> {
  dispatch: Dispatch<any>;
  paper: Paper;
  source: string;
  pageType: Scinapse.ActionTicket.PageType;
  shouldBlockUnverifiedUser: boolean;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  searchQueryText?: string;
  currentPage?: number;
}

class Title extends React.PureComponent<TitleProps, {}> {
  public render() {
    const { paper, searchQueryText, source } = this.props;
    const title = paper.titleHighlighted || paper.title;

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
          <a href={`/papers/${paper.id}`} onClick={this.handleClickTitle} className={styles.title}>
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
            pathname: `/papers/${paper.id}`,
          }}
        />
      </div>
    );
  }

  private handleClickTitle = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { dispatch, pageType, actionArea, paper, history } = this.props;
    e.preventDefault();

    const userGroupName: string = getUserGroupName(PAPER_FROM_SEARCH_TEST_NAME) || "";
    const currentArea = getCurrentPageType();

    if (currentArea === "searchResult") {
      const isBlocked = await getBlockedValueForPaperFromSearchTest(userGroupName, "searchResult");

      if (isBlocked) return;
    }

    actionTicketManager.trackTicket({
      pageType,
      actionType: "fire",
      actionArea: actionArea || pageType,
      actionTag: "paperShow",
      actionLabel: String(paper.id),
    });

    if (paper.abstractHighlighted || paper.titleHighlighted) {
      dispatch(
        ActionCreators.setHighlightContentInPaperShow({
          title: paper.titleHighlighted || "",
          abstract: paper.abstractHighlighted || "",
        })
      );
    }

    history.push(`/papers/${paper.id}`);
  };
}

export default connect()(withRouter(withStyles<typeof Title>(styles)(Title)));
