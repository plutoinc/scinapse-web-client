import * as React from 'react';
import axios from 'axios';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import * as format from 'date-fns/format';
import { CurrentUser } from '../../../model/currentUser';
import Abstract from './abstract';
import PaperActionButtons from './paperActionButtons';
import Title from './title';
import VenueAndAuthors from './venueAndAuthors';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SavedCollections from './savedCollections';
import { getUserGroupName } from '../../../helpers/abTestHelper';
import { SEARCH_ITEM_IMPROVEMENT_TEST } from '../../../constants/abTestGlobalValue';
const styles = require('./paperItem.scss');

export interface PaperItemProps {
  paper: Paper;
  savedAt: number | null; // unix time
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  searchQueryText: string;
  wrapperClassName: string;
  currentUser: CurrentUser;
}

const PaperItem: React.FC<PaperItemProps> = React.memo(props => {
  const { searchQueryText, paper, wrapperClassName, currentUser, pageType, actionArea, savedAt } = props;
  const { authors, publishedDate, doi, urls, journal, conferenceInstance, relation } = paper;

  const [shouldShowVisitHistory, setShouldShowVisitHistory] = React.useState(
    getUserGroupName(SEARCH_ITEM_IMPROVEMENT_TEST) === 'visitHistory'
  );

  React.useEffect(() => {
    setShouldShowVisitHistory(getUserGroupName(SEARCH_ITEM_IMPROVEMENT_TEST) === 'visitHistory');
  }, []);

  let source: string;
  if (!!doi) {
    source = `https://doi.org/${doi}`;
  } else if (urls && urls.length > 0) {
    source = urls[0].url;
  } else {
    source = '';
  }

  let historyContent = null;
  if (shouldShowVisitHistory && savedAt) {
    const lastVisitDate = format(savedAt, 'MMM DD, YYYY');
    const lastVisitFrom = distanceInWordsToNow(savedAt);
    historyContent = <div>{`You visited at ${lastVisitDate} (${lastVisitFrom} ago)`}</div>;
  }

  return (
    <div className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
      <div className={styles.contentSection}>
        {!!relation && relation.savedInCollections.length >= 1 ? (
          <SavedCollections collections={relation.savedInCollections} />
        ) : null}
        {historyContent}
        <Title
          paperId={paper.id}
          paperTitle={paper.title}
          highlightTitle={paper.titleHighlighted}
          highlightAbstract={paper.abstractHighlighted}
          pageType={pageType}
          actionArea={actionArea}
          source={source}
        />
        <VenueAndAuthors
          pageType={pageType}
          actionArea={actionArea}
          paper={paper}
          journal={journal}
          conferenceInstance={conferenceInstance}
          publishedDate={publishedDate}
          authors={authors}
        />
        <Abstract
          paperId={paper.id}
          pageType={pageType}
          actionArea={actionArea}
          abstract={paper.abstractHighlighted || paper.abstract}
          searchQueryText={searchQueryText}
        />
        <PaperActionButtons
          currentUser={currentUser}
          paper={paper}
          pageType={pageType}
          actionArea={actionArea}
          hasCollection={false}
        />
      </div>
    </div>
  );
});

export default withStyles<typeof PaperItem>(styles)(PaperItem);
