import * as React from 'react';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as format from 'date-fns/format';
import { CurrentUser } from '../../../model/currentUser';
import Abstract from './abstract';
import Figures from './figures';
import PaperActionButtons from './paperActionButtons';
import Title from './title';
import BlockVenue from './blockVenue';
import BlockAuthorList from './blockAuthorList';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SavedCollections from './savedCollections';
import { PaperSource } from '../../../api/paper';
const styles = require('./paperItem.scss');

export interface PaperItemProps {
  paper: Paper;
  savedAt: number | null; // unix time
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  searchQueryText: string;
  wrapperClassName: string;
  currentUser: CurrentUser;
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

const PaperItem: React.FC<PaperItemProps> = React.memo(props => {
  const { paper, wrapperClassName, currentUser, pageType, actionArea, savedAt, sourceDomain } = props;
  const { relation } = paper;

  let historyContent = null;
  if (savedAt) {
    const lastVisitDate = format(savedAt, 'MMM DD, YYYY');
    const lastVisitFrom = distanceInWordsToNow(savedAt);
    historyContent = (
      <div className={styles.visitedHistory}>{`You visited at ${lastVisitDate} (${lastVisitFrom} ago)`}</div>
    );
  }

  return (
    <div className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
      <div className={styles.contentSection}>
        {!!relation && relation.savedInCollections.length >= 1 ? (
          <SavedCollections collections={relation.savedInCollections} />
        ) : null}
        {historyContent}
        <Title paper={paper} pageType={pageType} actionArea={actionArea} />
        <div className={styles.venueAndAuthorWrapper}>
          <BlockVenue
            journal={paper.journal}
            conferenceInstance={paper.conferenceInstance}
            publishedDate={paper.publishedDate}
            pageType={pageType}
            actionArea={actionArea}
          />
          <BlockAuthorList paper={paper} authors={paper.authors} pageType={pageType} actionArea={actionArea} />{' '}
          <Abstract
            paperId={paper.id}
            pageType={pageType}
            actionArea={actionArea}
            abstract={paper.abstractHighlighted || paper.abstract}
          />
        </div>
        <Figures figures={paper.figures} paperId={paper.id} />
        <NotIncludedWords missingKeywords={paper.missingKeywords} />
        <PaperActionButtons
          currentUser={currentUser}
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          hasCollection={false}
          sourceDomain={sourceDomain}
        />
      </div>
    </div>
  );
});

export default withStyles<typeof PaperItem>(styles)(PaperItem);
