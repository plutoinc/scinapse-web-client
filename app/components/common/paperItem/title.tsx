import * as React from "react";
import { escapeRegExp } from "lodash";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps } from "react-router-dom";
import HighLightedContent from "../highLightedContent";
import { withStyles } from "../../../helpers/withStylesHelper";
import { formulaeToHTMLStr } from "../../../helpers/displayFormula";
import actionTicketManager from "../../../helpers/actionTicketManager";
import { ActionCreators } from "../../../actions/actionTypes";
const styles = require("./title.scss");

export interface TitleProps extends RouteComponentProps<any> {
  dispatch: Dispatch<any>;
  paperId: number;
  paperTitle: string;
  highlightTitle?: string;
  highlightAbstract?: string;
  source: string;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  searchQueryText?: string;
}

class Title extends React.PureComponent<TitleProps> {
  public render() {
    const { paperTitle, highlightTitle, searchQueryText, source, paperId } = this.props;
    const finalTitle = highlightTitle || paperTitle;

    if (!finalTitle) {
      return null;
    }

    const trimmedTitle = finalTitle
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    const noSearchQueryText = !searchQueryText;
    const searchQuery = escapeRegExp(searchQueryText);
    if (noSearchQueryText) {
      return (
        <div>
          <a href={`/papers/${paperId}`} onClick={this.handleClickTitle} className={styles.title}>
            <span dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(finalTitle) }} />
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

  private handleClickTitle = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    const { dispatch, pageType, actionArea, highlightTitle, highlightAbstract, paperId, history } = this.props;
    e.preventDefault();

    actionTicketManager.trackTicket({
      pageType,
      actionType: "fire",
      actionArea: actionArea || pageType,
      actionTag: "paperShow",
      actionLabel: String(paperId),
    });

    if (highlightTitle || highlightAbstract) {
      dispatch(
        ActionCreators.setHighlightContentInPaperShow({
          title: highlightTitle || "",
          abstract: highlightAbstract || "",
        })
      );
    }

    history.push(`/papers/${paperId}`);
  };
}

export default connect()(withRouter(withStyles<typeof Title>(styles)(Title)));
