import React, { FC } from 'react';
import MobilePaperShowItem from '../mobilePaperShowItem/mobilePaperShowItem';

interface Props {
  paperIds: number[];
  className?: string;
}

const MobileRelatedPapers: FC<Props> = ({ className, paperIds }) => {
  if (!paperIds || !paperIds.length) return null;

  return (
    <div className={className}>
      {paperIds.map(paperId => (
        <MobilePaperShowItem paperId={paperId} actionArea="relatedPaperList" pageType="paperShow" key={paperId} />
      ))}
    </div>
  );
};

export default MobileRelatedPapers;
