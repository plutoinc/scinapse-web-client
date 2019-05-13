import * as React from "react";
import * as URL from "url";
import * as classNames from "classnames";
import Popover from "@material-ui/core/Popover";
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
  handleCloseFunc: () => void;
  anchorEl: HTMLElement;
  paperSources: PaperSource[];
  pageType: Scinapse.ActionTicket.PageType;
  paperId: number;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

const SourceURLPopover: React.SFC<SourceURLPopover> = props => {
  const sources = props.paperSources
    .sort((a, b) => {
      if (isPDFLink(a) && !isPDFLink(b)) {
        return -1;
      }
      return 0;
    })
    .map(source => {
      if (!source.url) {
        return;
      }
      const urlObj = URL.parse(source.url);

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
            props.handleCloseFunc();
          }}
          target="_blank"
          rel="noopener nofollow"
          href={source.url}
          key={source.id}
        >
          <span
            className={classNames({
              [styles.host]: true,
              [styles.pdfHost]: isPDFLink(source),
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
        <Popover
          classes={{ paper: styles.sourcesWrapper }}
          onClose={props.handleCloseFunc}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={props.isOpen}
          anchorEl={props.anchorEl}
          elevation={0}
          style={{ zIndex: 10 }}
        >
          {sources}
        </Popover>
      )}
    </>
  );
};

export default withStyles<typeof SourceURLPopover>(styles)(SourceURLPopover);
