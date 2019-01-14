import * as React from "react";
import { Paper } from "../../../model/paper";
import { trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import SourceURLPopover from "../../common/sourceURLPopover";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import ScinapseButtonFactory, { ScinapseButtonType } from "../../common/scinapseButton/scinapseButtonFactory";
const styles = require("./pdfSourceButton.scss");

interface PdfSourceButtonProps {
  paper: Paper;
  wrapperStyle?: React.CSSProperties;
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
    const { paper } = this.props;
    const { isSourcePopoverOpen } = this.state;

    if (!paper) {
      return null;
    }

    const pdfSourceRecord =
      paper.urls &&
      paper.urls.find(paperSource => {
        if (paperSource && paperSource.url) {
          return (
            paperSource.url.startsWith("https://arxiv.org/pdf/") ||
            (paperSource.url.startsWith("http") && paperSource.url.endsWith(".pdf"))
          );
        } else {
          return false;
        }
      });

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
                className={styles.downloadButton}
                textWrapperClassName={styles.sourceButtonTextWrapper}
                linkProps={{
                  href: pdfSourceRecord ? pdfSourceRecord.url : paper.urls[0].url,
                  target: "_blank",
                  rel: "noopener",
                  style: {
                    marginLeft: "-8px",
                    paddingLeft: "8px",
                  },
                  className: styles.linkClassName,
                  onClick: () => {
                    this.handleClickPDFOrSource(!!pdfSourceRecord);
                  },
                }}
                dropdownBtnProps={{
                  onClick: this.handleToggleSourceDropdown,
                  style: {
                    height: "100%",
                    marginRight: "-8px",
                    paddingRight: "8px",
                  },
                  className: styles.dropdownBtn,
                }}
                leftIconNode={
                  pdfSourceRecord ? (
                    <Icon className={styles.pdfIconWrapper} icon="DOWNLOAD" />
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
