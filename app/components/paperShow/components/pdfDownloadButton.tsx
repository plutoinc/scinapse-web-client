import * as React from "react";
import { Paper } from "../../../model/paper";
import { withStyles } from "../../../helpers/withStylesHelper";
import ActionTicketManager from "../../../helpers/actionTicketManager";
import { trackEvent } from "../../../helpers/handleGA";
import Icon from "../../../icons";
import SearchingPDFBtn from "./searchingPDFBtn";
import { AUTH_LEVEL, blockUnverifiedUser } from "../../../helpers/checkAuthDialog";

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

  if (isLoadingOaCheck) {
    return <SearchingPDFBtn hasLoadingOaCheck={isLoadingOaCheck} />;
  }

  const pdfUrl = paper.bestPdf && paper.bestPdf.url;

  if (pdfUrl) {
    return (
      <a
        className={styles.pdfDownloadBtn}
        href={pdfUrl}
        target="_blank"
        rel="noopener"
        onClick={async e => {
          e.preventDefault();

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: "paperDescription",
            actionLabel: "downloadPdf",
            userActionType: "downloadPdf",
          });

          if (isBlocked) {
            return;
          }

          handleClickSource();
          window.open(pdfUrl, "_blank");
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
