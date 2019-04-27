import * as React from "react";
import { Paper } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import { shouldBlockToSignUp } from "../../../helpers/shouldBlockToSignUp";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { trackEvent } from "../../../helpers/handleGA";
import { getPDFLink } from "../../../helpers/getPDFLink";
import Icon from "../../../icons";
import SearchingPDFBtn from "./searchingPDFBtn";
const styles = require("./pdfSourceButton.scss");

interface PdfDownloadButtonProps {
  paper: Paper;
  isLoadingOaCheck: boolean;
  wrapperStyle?: React.CSSProperties;
}

const PdfDownloadButton: React.FunctionComponent<PdfDownloadButtonProps> = props => {
  const { paper, isLoadingOaCheck } = props;

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

  if (!paper) {
    return null;
  }

  const pdfSource = getPDFLink(paper.urls);

  if (!pdfSource) {
    return null;
  }

  if (isLoadingOaCheck) {
    return <SearchingPDFBtn hasLoadingOaCheck={isLoadingOaCheck} />;
  }

  const pdfSourceRecord = getPDFLink(paper.urls);

  if (paper.urls.length > 0 && pdfSourceRecord) {
    return (
      <a
        className={styles.pdfDownloadBtn}
        href={pdfSourceRecord.url}
        target="_blank"
        rel="noopener"
        onClick={async e => {
          e.preventDefault();
          const shouldBlock = await shouldBlockToSignUp("paperDescription", "source");
          if (shouldBlock) {
            return;
          }
          handleClickSource();
          window.open(pdfSourceRecord.url, "_blank");
        }}
      >
        <Icon icon="DOWNLOAD" className={styles.sourceIcon} />
        Download PDF
      </a>
    );
  }

  return null;
};

export default withStyles<typeof PdfDownloadButton>(styles)(PdfDownloadButton);
