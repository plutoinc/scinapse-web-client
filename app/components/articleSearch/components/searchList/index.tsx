import * as React from 'react';
import * as store from 'store';
import { Paper } from '../../../../model/paper';
import { CurrentUser } from '../../../../model/currentUser';
import { withStyles } from '../../../../helpers/withStylesHelper';
import PaperItem from '../../../common/paperItem/searchPaperItem';
import ArticleSpinner from '../../../common/spinner/articleSpinner';
import { RESEARCH_HISTORY_KEY, HistoryPaper } from '../../../researchHistory';
import PaperAPI, { PaperSource } from '../../../../api/paper';
import { getUserGroupName } from '../../../../helpers/abTestHelper';
import { SOURCE_DOMAIN_TEST } from '../../../../constants/abTestGlobalValue';
const styles = require('./searchList.scss');

interface SearchListProps {
  currentUser: CurrentUser;
  papers: Paper[];
  searchQueryText: string;
  isLoading: boolean;
}

const SearchList: React.FC<SearchListProps> = props => {
  const { currentUser, papers, searchQueryText, isLoading } = props;
  const historyPapers: HistoryPaper[] = store.get(RESEARCH_HISTORY_KEY) || [];
  const [sourceDomains, setSourceDomains] = React.useState<PaperSource[]>([]);

  React.useEffect(
    () => {
      if (getUserGroupName(SOURCE_DOMAIN_TEST) === 'sourceDomain') {
        PaperAPI.getSources(papers.map(p => p.id)).then(domains => {
          setSourceDomains(domains);
        });
      }
    },
    [papers]
  );

  if (!papers || !searchQueryText) return null;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  const searchItems = papers.map(paper => {
    const matchedPaper = historyPapers.find(p => p.id === paper.id);
    let savedAt = null;
    if (matchedPaper) {
      savedAt = matchedPaper.savedAt;
    }

    return (
      <PaperItem
        key={paper.id}
        paper={paper}
        pageType="searchResult"
        actionArea="searchResult"
        searchQueryText={searchQueryText}
        currentUser={currentUser}
        wrapperClassName={styles.searchItemWrapper}
        savedAt={savedAt}
      />
    );
  });

  return <div className={styles.searchItems}>{searchItems}</div>;
};

export default withStyles<typeof SearchList>(styles)(SearchList);
