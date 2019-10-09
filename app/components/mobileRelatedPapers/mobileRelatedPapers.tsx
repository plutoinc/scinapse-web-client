import React, { FC } from 'react';
import MobilePaperShowItem from '../mobilePaperShowItem/mobilePaperShowItem';
const s = require('./mobileRelatedPapers.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

interface Props {
  paperIds: number[];
  className?: string;
}

const MobileRelatedPapers: FC<Props> = ({ className, paperIds }) => {
  useStyles(s);
  if (!paperIds || !paperIds.length) return null;

  return (
    <div className={className}>
      {paperIds.map(paperId => (
        <MobilePaperShowItem
          className={s.relatedPaperItem}
          paperId={paperId}
          actionArea="relatedPaperList"
          pageType="paperShow"
          key={paperId}
        />
      ))}
    </div>
  );
};

export default MobileRelatedPapers;
