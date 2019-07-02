import * as React from 'react';
import { CurrentUser } from '../../../model/currentUser';
import Abstract from './abstract';
import PaperActionButtons from './paperActionButtons';
import Title from './title';
import VenueAndAuthors from './venueAndAuthors';
import BlockVenue from './blockVenue';
import BlockAuthorList from './blockAuthorList';
import { withStyles } from '../../../helpers/withStylesHelper';
import { Paper } from '../../../model/paper';
import SavedCollections from './savedCollections';
import { getUserGroupName } from '../../../helpers/abTestHelper';
import { SEARCH_ITEM_IMPROVEMENT_TEST } from '../../../constants/abTestGlobalValue';
import { STOP_WORDS } from '../highLightedContent';
const styles = require('./paperItem.scss');

export interface PaperItemProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  searchQueryText: string;
  wrapperClassName: string;
  currentUser: CurrentUser;
}

export function getMissingWords(sentence: string, source: string): string[] {
  return Array.from(new Set(sentence.toLowerCase().split(' '))).filter(
    word => !STOP_WORDS.includes(word) && !source.toLowerCase().includes(word)
  );
}

const PaperItem: React.FC<PaperItemProps> = React.memo(props => {
  const { searchQueryText, paper, wrapperClassName, currentUser, pageType, actionArea } = props;
  const { doi, urls, relation } = paper;

  const [venueAuthorType, setVenueAuthorType] = React.useState<'broadAuthorVenue' | 'control' | ''>('');

  React.useEffect(() => {
    setVenueAuthorType(
      getUserGroupName(SEARCH_ITEM_IMPROVEMENT_TEST) === 'broadAuthorVenue' ? 'broadAuthorVenue' : 'control'
    );
  }, []);

  let venueAndAuthor = null;
  if (venueAuthorType === 'broadAuthorVenue') {
    venueAndAuthor = (
      <>
        <BlockVenue
          journal={paper.journal}
          conferenceInstance={paper.conferenceInstance}
          publishedDate={paper.publishedDate}
          pageType={pageType}
          actionArea={actionArea}
        />
        <BlockAuthorList paper={paper} authors={paper.authors} pageType={pageType} actionArea={actionArea} />
      </>
    );
  } else if (venueAuthorType === 'control') {
    venueAndAuthor = (
      <VenueAndAuthors
        pageType={pageType}
        actionArea={actionArea}
        paper={paper}
        journal={paper.journal}
        conferenceInstance={paper.conferenceInstance}
        publishedDate={paper.publishedDate}
        authors={paper.authors}
      />
    );
  }

  let source;
  if (!!doi) {
    source = `https://doi.org/${doi}`;
  } else if (urls && urls.length > 0) {
    source = urls[0].url;
  } else {
    source = '';
  }

  return (
    <div className={`${wrapperClassName ? wrapperClassName : styles.paperItemWrapper}`}>
      <div className={styles.contentSection}>
        {!!relation && relation.savedInCollections.length >= 1 ? (
          <SavedCollections collections={relation.savedInCollections} />
        ) : null}
        <Title
          paperId={paper.id}
          paperTitle={paper.title}
          highlightTitle={paper.titleHighlighted}
          highlightAbstract={paper.abstractHighlighted}
          pageType={pageType}
          actionArea={actionArea}
          source={source}
        />
        {venueAndAuthor}
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
