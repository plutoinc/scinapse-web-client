import * as React from 'react';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as format from 'date-fns/format';
import Figures from './figures';
import PaperItemButtonGroup from './paperItemButtonGroup';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SavedCollections from './savedCollections';
import { PaperSource } from '../../../api/paper';
import Title from './title';
import BlockVenueAuthor from './blockVenueAuthor';
import Abstract from './abstract';
import { useSelector } from 'react-redux';
import { AppState } from '../../../reducers';
import { UserDevice } from '../../layouts/reducer';
import MobileVenueAuthors from './mobileVenueAuthors';
import { useObserver } from '../../../hooks/useIntersectionHook';
const styles = require('./searchPaperItem.scss');

export interface PaperItemProps {
  paper: Paper;
  savedAt: number | null; // unix time
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  sourceDomain?: PaperSource;
}

const NotIncludedWords: React.FC<{ missingKeywords: string[] }> = React.memo(props => {
  const { missingKeywords } = props;

  if (missingKeywords.length === 0) return null;

  const wordComponents = missingKeywords.map((word, i) => {
    return (
      <React.Fragment key={i}>
        <span className={styles.missingWord}>{word}</span>
        {i !== missingKeywords.length - 1 && ` `}
      </React.Fragment>
    );
  });

  return (
    <div className={styles.missingWordsWrapper}>
      {`Not included: `}
      {wordComponents}
    </div>
  );
});

const SearchPaperItem: React.FC<PaperItemProps> = React.memo(props => {
  const { paper, pageType, actionArea, savedAt, sourceDomain } = props;
  const { relation } = paper;
  const { elRef } = useObserver(0.8, {
    pageType,
    actionArea,
    actionType: 'view',
    actionTag: 'paperShow',
    actionLabel: String(paper.id),
  });

  const userDevice = useSelector((state: AppState) => state.layout.userDevice);
  let venueAuthors = (
    <div style={{ marginTop: '12px' }}>
      <BlockVenueAuthor paper={paper} pageType={pageType} actionArea={actionArea} />
    </div>
  );
  if (userDevice === UserDevice.MOBILE) {
    venueAuthors = <MobileVenueAuthors paper={paper} pageType={pageType} actionArea={actionArea} />;
  }

  let historyContent = null;
  if (savedAt) {
    const lastVisitDate = format(savedAt, 'MMM DD, YYYY');
    const lastVisitFrom = distanceInWordsToNow(savedAt);
    historyContent = (
      <div className={styles.visitedHistory}>{`You visited at ${lastVisitDate} (${lastVisitFrom} ago)`}</div>
    );
  }

  return (
    <div ref={elRef} className={styles.paperItemWrapper}>
      {!!relation &&
        relation.savedInCollections.length >= 1 && <SavedCollections collections={relation.savedInCollections} />}
      {historyContent}
      <Title paper={paper} actionArea={actionArea} pageType={pageType} />
      {venueAuthors}
      <Abstract
        paperId={paper.id}
        abstract={paper.abstractHighlighted || paper.abstract}
        pageType={pageType}
        actionArea={actionArea}
      />
      <Figures figures={paper.figures} paperId={paper.id} />
      <NotIncludedWords missingKeywords={paper.missingKeywords} />
      <PaperItemButtonGroup
        paper={paper}
        pageType={pageType}
        actionArea={actionArea}
        paperSource={sourceDomain}
        saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
      />
    </div>
  );
});

export default withStyles<typeof SearchPaperItem>(styles)(SearchPaperItem);
