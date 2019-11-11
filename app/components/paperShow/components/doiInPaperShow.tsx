import React from 'react';
import { useDispatch } from 'react-redux';
import copySelectedTextToClipboard from '../../../helpers/copySelectedTextToClipboard';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { addPaperToRecommendPool } from '../../recommendPool/actions';
const useStyles = require('isomorphic-style-loader/useStyles');

const s = require('./doiInPaperShow.scss');

interface DoiInPaperShowProps {
  doi: string;
  paperId: string;
}

const DoiInPaperShow: React.FC<DoiInPaperShowProps> = props => {
  useStyles(s);
  const dispatch = useDispatch();
  const { doi, paperId } = props;

  if (!doi) {
    return null;
  }

  const clickDOIButton = () => {
    copySelectedTextToClipboard(`https://doi.org/${doi}`);

    dispatch(addPaperToRecommendPool({ paperId, action: 'copyDoi' }));
    ActionTicketManager.trackTicket({
      pageType: 'paperShow',
      actionType: 'fire',
      actionArea: 'paperDescription',
      actionTag: 'copyDoi',
      actionLabel: String(paperId),
    });
  };

  return (
    <div className={s.doiWrapper}>
      <span className={s.doiTitle}>· DOI :</span>
      <span className={s.doiContext}>{doi}</span>
      <button className={s.tinyButton} onClick={clickDOIButton}>
        <Icon icon="COPY_DOI" />
        <span>Copy DOI</span>
      </button>
    </div>
  );
};

export default DoiInPaperShow;
