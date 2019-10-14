import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import SearchingPDFBtn from './searchingPDFBtn';
import { AUTH_LEVEL, blockUnverifiedUser } from '../../../helpers/checkAuthDialog';
import { addPaperToRecommendPool } from '../../recommendPool/actions';
const styles = require('./pdfSourceButton.scss');

interface PdfDownloadButtonProps {
  paper: Paper;
  isLoading: boolean;
  actionArea: Scinapse.ActionTicket.ActionArea;
  onDownloadedPDF: (isDownload: boolean) => void;
  handleSetScrollAfterDownload: () => void;
  wrapperStyle?: React.CSSProperties;
}

const PdfDownloadButton: React.FunctionComponent<PdfDownloadButtonProps> = props => {
  const { paper, isLoading, onDownloadedPDF, handleSetScrollAfterDownload, actionArea } = props;
  const dispatch = useDispatch();

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

          dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'downloadPdf' }));

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
