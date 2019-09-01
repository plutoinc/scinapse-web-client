import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserDevice } from '../../layouts/reducer';
import Icon from '../../../icons';
import { PaperSource } from '../../../api/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { AppState } from '../../../reducers';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { addPaperToRecommendPoolAndOpenDialog } from '../../recommendPool/recommendPoolActions';
const styles = require('./sourceButton.scss');

interface SourceButtonProps {
  paperId: number;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
}

const SourceButton: React.FC<SourceButtonProps> = ({ paperSource, paperId, pageType, actionArea }) => {
  const dispatch = useDispatch();
  const userDevice = useSelector<AppState, UserDevice>(state => state.layout.userDevice);

  if (!paperSource || (!paperSource.source && !paperSource.doi)) return null;

  const buttonContext = userDevice == UserDevice.MOBILE ? 'Source' : paperSource.host;

  return (
    <a
      href={`https://doi.org/${paperSource.doi}`}
      target="_blank"
      rel="noopener nofollow noreferrer"
      className={styles.sourceButton}
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea: actionArea || pageType,
          actionTag: 'source',
          actionLabel: String(paperId),
        });
        dispatch(
          addPaperToRecommendPoolAndOpenDialog({
            pageType,
            actionArea: 'sourceButton',
            paperId,
          })
        );
      }}
    >
      <img
        className={styles.faviconIcon}
        src={`https://www.google.com/s2/favicons?domain=${paperSource.source}`}
        alt={`${paperSource.host} favicon`}
      />
      <span className={styles.sourceHostInfo}>{buttonContext}</span>
      <Icon icon="SOURCE" className={styles.extSourceIcon} />
    </a>
  );
};

export default withStyles<typeof SourceButton>(styles)(SourceButton);
