import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserDevice } from '../../layouts/reducer';
import Icon from '../../../icons';
import { PaperSource } from '../../../api/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import { AppState } from '../../../reducers';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { addPaperToRecommendPool } from '../../recommendPool/actions';
import { Paper } from '../../../model/paper';
import { Button } from '@pluto_network/pluto-design-elements';
const styles = require('./sourceButton.scss');

interface SourceButtonProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
  isMobile?: boolean;
}

const SourceButton: React.FC<SourceButtonProps> = ({ paperSource, pageType, actionArea, paper, isMobile }) => {
  const dispatch = useDispatch();
  const userDevice = useSelector<AppState, UserDevice>(state => state.layout.userDevice);
  const noUrls = !paper.doi && (!paper.urls || paper.urls.length === 0);
  const noPaperSource = !paperSource || (!paperSource.source && !paperSource.doi);

  if (noPaperSource && noUrls) return null;

  if (paperSource) {
    const buttonContext = userDevice == UserDevice.MOBILE ? 'Source' : paperSource.host;

    return (
      <Button
        elementType="anchor"
        href={`https://doi.org/${paperSource.doi}`}
        target="_blank"
        rel="noopener nofollow noreferrer"
        size="small"
        variant={isMobile ? 'contained' : 'outlined'}
        color={isMobile ? 'black' : 'gray'}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'source',
            actionLabel: String(paper.id),
          });
          dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'source' }));
        }}
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${paperSource.source}`}
          alt={`${paperSource.host} favicon`}
        />
        <span className={styles.sourceHostInfo}>{buttonContext}</span>
        <Icon icon="SOURCE" className={styles.extSourceIcon} />
      </Button>
    );
  }

  const destination = paper.doi ? `https://doi.org/${paper.doi}` : paper.urls[0].url;

  return (
    <Button
      elementType="anchor"
      href={destination}
      target="_blank"
      rel="noopener nofollow noreferrer"
      size="small"
      variant={isMobile ? 'contained' : 'outlined'}
      color={isMobile ? 'black' : 'gray'}
      onClick={() => {
        ActionTicketManager.trackTicket({
          pageType,
          actionType: 'fire',
          actionArea: actionArea || pageType,
          actionTag: 'source',
          actionLabel: String(paper.id),
        });
        dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'source' }));
      }}
    >
      <Icon icon="EXTERNAL_SOURCE" />
      <span className={styles.sourceHostInfo}>Source</span>
    </Button>
  );
};

export default withStyles<typeof SourceButton>(styles)(SourceButton);
