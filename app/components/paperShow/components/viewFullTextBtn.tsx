import * as React from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import SearchingPDFBtn from './searchingPDFBtn';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { addPaperToRecommendPoolAndOpenDialog } from '../../recommendOnboardingSnackbar/recommendPoolActions';

const styles = require('./viewFullTextBtn.scss');

interface ViewFullTextBtnProps {
  paperId: number;
  handleClickFullText: () => void;
  isLoading: boolean;
}

const ViewFullTextBtn: React.FC<ViewFullTextBtnProps> = props => {
  const { isLoading, handleClickFullText, paperId } = props;
  const dispatch = useDispatch();

  if (isLoading) {
    return <SearchingPDFBtn isLoading={isLoading} />;
  }

  return (
    <button
      className={styles.btnStyle}
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType: 'paperShow',
          actionType: 'fire',
          actionArea: 'paperDescription',
          actionTag: 'viewFullText',
          actionLabel: String(paperId),
        });
        handleClickFullText();
        dispatch(
          addPaperToRecommendPoolAndOpenDialog({
            pageType: 'paperShow',
            actionArea: 'viewFullTextButton',
            recAction: { paperId, action: 'viewMorePDF' },
          })
        );
      }}
    >
      <Icon className={styles.pdfIcon} icon={'PDF_PAPER'} />View Full-Text
    </button>
  );
};

export default withStyles<typeof ViewFullTextBtn>(styles)(ViewFullTextBtn);
