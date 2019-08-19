import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import SearchingPDFBtn from './searchingPDFBtn';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../../helpers/checkAuthDialog';
import { CurrentUser } from '../../../model/currentUser';
import { addPaperToRecommendation, openRecommendationPapersGuideDialog } from '../../../actions/recommendation';
const styles = require('./pdfSourceButton.scss');

interface PdfDownloadButtonProps {
  paper: Paper;
  isLoading: boolean;
  currentUser: CurrentUser;
  actionArea: Scinapse.ActionTicket.ActionArea;
  dispatch: Dispatch<any>;
  onDownloadedPDF: (isDownload: boolean) => void;
  handleSetScrollAfterDownload: () => void;
  wrapperStyle?: React.CSSProperties;
}

const PdfDownloadButton: React.FunctionComponent<PdfDownloadButtonProps> = props => {
  const { paper, isLoading, onDownloadedPDF, handleSetScrollAfterDownload, actionArea, currentUser, dispatch } = props;

  function trackActionToClickPdfDownloadBtn() {
    ActionTicketManager.trackTicket({
      pageType: 'paperShow',
      actionType: 'fire',
      actionArea: actionArea,
      actionTag: 'downloadPdf',
      actionLabel: String(paper.id),
    });
  }

  if (!paper) {
    return null;
  }

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  const pdfUrl = paper.bestPdf && paper.bestPdf.url;

  if (pdfUrl) {
    return (
      <a
        aria-label="Scinapse pdf download button in paper"
        className={styles.pdfDownloadBtn}
        href={pdfUrl}
        target="_blank"
        rel="noopener nofollow noreferrer"
        onClick={async e => {
          e.preventDefault();
          trackActionToClickPdfDownloadBtn();

          addPaperToRecommendation(currentUser.isLoggedIn, paper.id);

          const isBlocked = await blockUnverifiedUser({
            authLevel: AUTH_LEVEL.VERIFIED,
            actionArea: actionArea,
            actionLabel: 'downloadPdf',
            userActionType: 'downloadPdf',
          });

          if (isBlocked) {
            return;
          }

          window.open(pdfUrl, '_blank');
          onDownloadedPDF(true);
          handleSetScrollAfterDownload();
          dispatch(openRecommendationPapersGuideDialog(currentUser.isLoggedIn, 'downloadPdfBtn'));
        }}
      >
        <Icon icon="DOWNLOAD" className={styles.sourceIcon} />
        Download PDF
      </a>
    );
  }

  return null;
};

export default connect()(withStyles<typeof PdfDownloadButton>(styles)(PdfDownloadButton));
