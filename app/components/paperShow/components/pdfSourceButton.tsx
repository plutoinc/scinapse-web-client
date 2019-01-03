import * as React from "react";
import { Paper } from "../../../model/paper";
import { trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
import ActionTicketManager from "../../../helpers/actionTicketManager";
const styles = require("./pdfSourceButton.scss");

interface PdfSourceButtonProps {
  paper: Paper;
  wrapperStyle?: React.CSSProperties;
}

const handleClickPDFButton = (paper: Paper) => {
  if (paper) {
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
};

const PdfSourceButton = (props: PdfSourceButtonProps) => {
  const { paper, wrapperStyle } = props;

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

  if (pdfSourceRecord) {
    return (
      <a
        onClick={() => {
          handleClickPDFButton(paper);
        }}
        style={wrapperStyle}
        className={styles.downloadButton}
        href={pdfSourceRecord.url}
        target="_blank"
      >
        <Icon icon="DOWNLOAD" />
        <span>Download PDF</span>
      </a>
    );
  } else {
    let source: string;
    if (paper.doi) {
      source = `https://doi.org/${paper.doi}`;
    } else if (paper.urls && paper.urls[0]) {
      source = paper.urls[0].url;
    } else {
      source = "";
    }

    if (source && source.length > 0) {
      return (
        <a
          style={wrapperStyle}
          className={styles.downloadButton}
          href={source}
          onClick={() => {
            trackEvent({
              category: "New Paper Show",
              action: "Click View in Source in PaperContent Section",
              label: `Link to ${source}`,
            });

            ActionTicketManager.trackTicket({
              pageType: "paperShow",
              actionType: "fire",
              actionArea: "paperDescription",
              actionTag: "source",
              actionLabel: String(paper.id),
            });
          }}
          target="_blank"
        >
          <Icon icon="EXTERNAL_SOURCE" />
          <span>View in Source</span>
        </a>
      );
    }
  }

  return null;
};

export default withStyles<typeof PdfSourceButton>(styles)(PdfSourceButton);
