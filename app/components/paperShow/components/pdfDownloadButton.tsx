import * as React from "react";
import { Paper } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import ScinapseButtonFactory, { ScinapseButtonType } from "../../common/scinapseButton/scinapseButtonFactory";
import SourceURLPopover from "../../common/sourceURLPopover";
import * as classNames from "classnames";
import { shouldBlockToSignUp } from "../../../helpers/shouldBlockToSignUp";
import Icon from "../../../icons";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { trackEvent } from "../../../helpers/handleGA";
import { getPDFLink } from "../../../helpers/getPDFLink";
const styles = require("./pdfSourceButton.scss");

interface PdfDownloadButtonProps {
  paper: Paper;
  wrapperStyle?: React.CSSProperties;
}

const PdfDownloadButton: React.FunctionComponent<PdfDownloadButtonProps> = props => {
  const [isSourcePopoverOpen, setIsSourcePopoverOpen] = React.useState(false);
  const pdfDownloadButton = React.useRef<HTMLDivElement | null>(null);

  const { paper } = props;

  function handleClickSource() {
    trackEvent({
      category: "New Paper Show",
      action: "Click PDF Download button in PaperContent Section",
      label: `Link to Paper ID : ${paper.id} download`,
    });

    ActionTicketManager.trackTicket({
      pageType: "paperShow",
      actionType: "fire",
      actionArea: "paperDescription",
      actionTag: "downloadPdf",
      actionLabel: String(paper.id),
    });
  }

  function handleCloseSourceDropdown(e: any) {
    const path = e.path || (e.composedPath && e.composedPath());

    if (path && path.includes(this.sourceButton)) {
      return;
    }

    setIsSourcePopoverOpen(false);
  }

  if (!paper) {
    return null;
  }

  const pdfSourceRecord = getPDFLink(paper.urls);

  if (paper.urls.length > 0 && pdfSourceRecord) {
    const Button = ScinapseButtonFactory(ScinapseButtonType.buttonWithArrow);
    return (
      <SourceURLPopover
        buttonEl={
          <div ref={pdfDownloadButton}>
            <Button
              isUpArrow={!isSourcePopoverOpen}
              hasArrow={paper.urls.length > 1}
              text={"Download PDF"}
              arrowIconClassName={styles.arrowIcon}
              className={classNames({
                [styles.downloadButton]: true,
                [styles.reverseDownloadBtn]: true,
              })}
              textWrapperClassName={styles.sourceButtonTextWrapper}
              linkProps={{
                href: pdfSourceRecord.url,
                target: "_blank",
                rel: "noopener",
                className: styles.linkClassName,
                onClick: async e => {
                  e.preventDefault();
                  const shouldBlock = await shouldBlockToSignUp("paperDescription", "source");
                  if (shouldBlock) {
                    return;
                  }
                  handleClickSource();
                  window.open(pdfSourceRecord.url, "_blank");
                },
              }}
              dropdownBtnProps={{
                onClick: () => {
                  setIsSourcePopoverOpen(!isSourcePopoverOpen);
                },
                style: { height: "100%", width: "36px", borderLeft: "1px solid #6096ff" },
                className: styles.dropdownBtn,
              }}
              leftIconNode={<Icon icon="EXTERNAL_SOURCE" className={styles.sourceIcon} />}
            />
          </div>
        }
        isOpen={isSourcePopoverOpen}
        handleCloseFunc={handleCloseSourceDropdown}
        anchorEl={pdfDownloadButton.current!}
        paperSources={paper.urls}
        pageType="paperShow"
        paperId={paper.id}
        actionArea="paperDescription"
      />
    );
  }

  return null;
};

export default withStyles<typeof PdfDownloadButton>(styles)(PdfDownloadButton);
