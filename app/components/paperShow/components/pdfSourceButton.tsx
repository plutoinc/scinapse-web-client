import * as React from "react";
import * as classNames from "classnames";
import { Paper } from "../../../model/paper";
import { trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import SourceURLPopover from "../../common/sourceURLPopover";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { getPDFLink } from "../../../helpers/getPDFLink";
import ScinapseButtonFactory, { ScinapseButtonType } from "../../common/scinapseButton/scinapseButtonFactory";
const styles = require("./pdfSourceButton.scss");

interface PdfSourceButtonProps {
  paper: Paper;
  wrapperStyle?: React.CSSProperties;
  reverseColor?: boolean;
  fullTextAB: "A" | "B";
}

interface PdfSourceButtonState {
  isSourcePopoverOpen: boolean;
}

class PdfButton extends React.PureComponent<PdfSourceButtonProps, PdfSourceButtonState> {
  private sourceButton: HTMLDivElement | null;

  public constructor(props: PdfSourceButtonProps) {
    super(props);

    this.state = {
      isSourcePopoverOpen: false,
    };
  }

  public render() {
    const { paper, reverseColor, fullTextAB } = this.props;
    const { isSourcePopoverOpen } = this.state;

    if (!paper) {
      return null;
    }

    const pdfSourceRecord = getPDFLink(paper.urls);

    if (paper.urls.length > 0) {
      const Button = ScinapseButtonFactory(ScinapseButtonType.buttonWithArrow);
      return (
        <SourceURLPopover
          buttonEl={
            <div ref={el => (this.sourceButton = el)}>
              <Button
                isUpArrow={!isSourcePopoverOpen}
                hasArrow={paper.urls.length > 1}
                text={pdfSourceRecord ? "Download PDF" : "View in Source"}
                arrowIconClassName={styles.arrowIcon}
                className={classNames({
                  [styles.downloadButton]: true,
                  [styles.reverseDownloadBtn]: reverseColor,
                })}
                textWrapperClassName={styles.sourceButtonTextWrapper}
                linkProps={{
                  href: pdfSourceRecord ? pdfSourceRecord.url : paper.urls[0].url,
                  target: "_blank",
                  rel: "noopener",
                  className: styles.linkClassName,
                  onClick: () => {
                    this.handleClickPDFOrSource(!!pdfSourceRecord);
                  },
                }}
                dropdownBtnProps={{
                  onClick: this.handleToggleSourceDropdown,
                  style: {
                    height: "100%",
                    width: "36px",
                    borderLeft: fullTextAB === "A" ? "1px solid rgba(222, 225, 232, 0.35)" : "1px solid #6096ff",
                  },
                  className: styles.dropdownBtn,
                }}
                leftIconNode={
                  pdfSourceRecord ? (
                    <Icon icon="DOWNLOAD" className={styles.pdfIconWrapper} />
                  ) : (
                    <Icon icon="EXTERNAL_SOURCE" className={styles.sourceIcon} />
                  )
                }
              />
            </div>
          }
          isOpen={isSourcePopoverOpen}
          handleCloseFunc={this.handleCloseSourceDropdown}
          anchorEl={this.sourceButton!}
          paperSources={paper.urls}
          pageType="paperShow"
          paperId={paper.id}
          actionArea="paperDescription"
        />
      );
    }

    return null;
  }

  private handleToggleSourceDropdown = () => {
    this.setState(prevState => ({ ...prevState, isSourcePopoverOpen: !this.state.isSourcePopoverOpen }));
  };

  private handleCloseSourceDropdown = (e: any) => {
    const path = e.path || (e.composedPath && e.composedPath());

    if (path && path.includes(this.sourceButton)) {
      return;
    }

    this.setState(prevState => ({ ...prevState, isSourcePopoverOpen: false }));
  };

  private handleClickPDFOrSource = (isPdf: boolean) => {
    const { paper } = this.props;

    if (isPdf) {
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
    } else {
      ActionTicketManager.trackTicket({
        pageType: "paperShow",
        actionType: "fire",
        actionArea: "paperDescription",
        actionTag: "source",
        actionLabel: String(paper.id),
      });
    }
  };
}

export default withStyles<typeof PdfButton>(styles)(PdfButton);
