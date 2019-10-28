import React, { FC } from 'react';
import { Paper } from '../../model/paper';
import { PaperSource } from '../../api/paper';
import SourceButton from '../common/paperItem/sourceButton';
import CiteButton from '../common/paperItem/citeButton';
import CollectionButton from '../common/paperItem/collectionButton';

const s = require('./mobilePaperShowButtonGroup.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

interface Props {
  paper: Paper;
  saved: boolean;
  className: string;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  paperSource?: PaperSource;
}

const MobilePaperShowButtonGroup: FC<Props> = ({ paper, pageType, actionArea, paperSource, saved, className }) => {
  useStyles(s);
  return (
    <div className={className}>
      <div className={s.buttonWrapper}>
        <CiteButton
          className={s.citeButton}
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          isMobile={true}
        />
      </div>
      <div className={s.buttonWrapper}>
        <SourceButton
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          paperSource={paperSource}
          isMobile={true}
        />
      </div>
      <div className={s.buttonWrapper}>
        <CollectionButton paper={paper} saved={!!saved} pageType={pageType} actionArea={actionArea} />
      </div>
    </div>
  );
};

export default MobilePaperShowButtonGroup;
