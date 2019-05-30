import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { withStyles } from "../../../helpers/withStylesHelper";
import { formulaeToHTMLStr } from "../../../helpers/displayFormula";
import actionTicketManager from "../../../helpers/actionTicketManager";
import { ActionCreators } from "../../../actions/actionTypes";
import Icon from "../../../icons";
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
    const { paperTitle, highlightTitle, paperId } = this.props;
    const finalTitle = highlightTitle || paperTitle;

    if (!finalTitle) {
      return null;
    }

    const trimmedTitle = finalTitle
      .replace(/^ /gi, "")
      .replace(/\s{2,}/g, " ")
      .replace(/#[A-Z0-9]+#/g, "");

    return (
      <div>
        <Link
          to={`/papers/${paperId}`}
          onClick={() => {
            this.handleClickTitle(false);
          }}
          dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(trimmedTitle) }}
          className={styles.title}
        />
        <a href={`/papers/${paperId}`} target="_blank" rel="noopener noreferrer" className={styles.externalIconWrapper}>
          <Icon
            onClick={() => {
              this.handleClickTitle(true);
            }}
            icon="NEW_TAB"
            className={styles.externalIcon}
          />
        </a>
      </div>
    );
  }

  private handleClickTitle = (fromNewTab?: boolean) => {
    const { dispatch, pageType, actionArea, paperId, highlightTitle, highlightAbstract } = this.props;
    actionTicketManager.trackTicket({
      pageType,
      actionType: "fire",
      actionArea: actionArea || pageType,
      actionTag: "paperShow",
      actionLabel: String(paperId),
    });

    if (fromNewTab) {
      actionTicketManager.trackTicket({
        pageType,
        actionType: "fire",
        actionArea: "titleNewTab",
        actionTag: "paperShow",
        actionLabel: String(paperId),
      });
    }

    if (highlightTitle || highlightAbstract) {
      dispatch(
        ActionCreators.setHighlightContentInPaperShow({
          title: highlightTitle || "",
          abstract: highlightAbstract || "",
        })
      );
    }
  };
}

export default connect()(withRouter(withStyles<typeof Title>(styles)(Title)));
