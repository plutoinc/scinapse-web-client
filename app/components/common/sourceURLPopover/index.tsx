import * as React from "react";
import * as URL from "url";
import Popper from "@material-ui/core/Popper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { withStyles } from "../../../helpers/withStylesHelper";
import { PaperSource } from "../../../model/paperSource";
import { trackAndOpenLink } from "../../../helpers/handleGA";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { PageType, ActionArea } from "../../../helpers/actionTicketManager/actionTicket";
const styles = require("./sourceURLPopover.scss");

interface SourceURLPopover {
  buttonEl: React.ReactNode;
  isOpen: boolean;
  handleCloseFunc: (e: any) => void;
  anchorEl: HTMLElement;
  paperSources: PaperSource[];
  pageType: PageType;
  paperId: number;
  actionArea?: ActionArea;
}

const SourceURLPopover: React.SFC<SourceURLPopover> = props => {
  const sources = props.paperSources.map(url => {
    if (!url.url) {
      return;
    }

    const urlObj = URL.parse(url.url);
    return (
      <a
        className={styles.sourceItem}
        onClick={() => {
          trackAndOpenLink("search-item-source-button");
          ActionTicketManager.trackTicket({
            pageType: props.pageType,
            actionType: "fire",
            actionArea: props.actionArea || props.pageType,
            actionTag: "source",
            actionLabel: String(props.paperId),
          });
        }}
        target="_blank"
        rel="noopener"
        href={url.url}
        key={url.id}
      >
        {urlObj.host}
      </a>
    );
  });

  return (
    <>
      {props.buttonEl}
      {props.isOpen && (
        <Popper
          placement="bottom-end"
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
