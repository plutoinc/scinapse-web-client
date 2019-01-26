import * as React from "react";
import * as URL from "url";
import * as classNames from "classnames";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperSource } from "../../../model/paperSource";
import { trackAndOpenLink } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import Icon from "../../../icons";
import { isPDFLink } from "../../../helpers/getPDFLink";
const styles = require("./sourceURLPopover.scss");

interface SourceURLPopover {
  buttonEl: React.ReactNode;
  isOpen: boolean;
  handleCloseFunc: (e: any) => void;
  anchorEl: HTMLElement;
  paperSources: PaperSource[];
  pageType: Scinapse.ActionTicket.PageType;
  paperId: number;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

const SourceURLPopover: React.SFC<SourceURLPopover> = props => {
  const sources = props.paperSources
    .sort((a, _b) => {
      if (isPDFLink(a.url)) {
        return -1;
      }
      return 0;
    })
    .map(url => {
      if (!url.url) {
        return;
      }
      const urlObj = URL.parse(url.url);

      return (
        <a
          className={styles.sourceItem}
          onClick={e => {
            trackAndOpenLink("search-item-source-button");
            ActionTicketManager.trackTicket({
              pageType: props.pageType,
              actionType: "fire",
              actionArea: props.actionArea || props.pageType,
              actionTag: "source",
              actionLabel: String(props.paperId),
            });
            props.handleCloseFunc(e);
          }}
          target="_blank"
          rel="noopener"
          href={url.url}
          key={url.id}
        >
          {isPDFLink(url.url) && <span>{`[PDF] `}</span>}
          <span
            className={classNames({
              [styles.host]: true,
              [styles.pdfHost]: isPDFLink(url.url),
            })}
          >
            {urlObj.host}
          </span>
          <Icon icon="EXTERNAL_SOURCE" className={styles.sourceIcon} />
        </a>
      );
    });

  return (
    <>
      {props.buttonEl}
      {props.isOpen && (
        <Popper
          placement="bottom-start"
          modifiers={{
            preventOverflow: {
              enabled: true,
              boundariesElement: "window",
            },
          }}
          open={props.isOpen}
          anchorEl={props.anchorEl}
        >
          <ClickAwayListener onClickAway={props.handleCloseFunc}>
            <div className={styles.sourcesWrapper}>{sources}</div>
          </ClickAwayListener>
        </Popper>
      )}
    </>
  );
};

export default withStyles<typeof SourceURLPopover>(styles)(SourceURLPopover);
