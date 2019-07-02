import * as React from 'react';
import { Paper } from '../../../../model/paper';
import { CurrentUser } from '../../../../model/currentUser';
import { withStyles } from '../../../../helpers/withStylesHelper';
import PaperItem from '../../../common/paperItem/searchPaperItem';
import ArticleSpinner from '../../../common/spinner/articleSpinner';
const styles = require('./searchList.scss');

interface SearchListProps {
  currentUser: CurrentUser;
  papers: Paper[];
  searchQueryText: string;
  isLoading: boolean;
}

const SearchList: React.FC<SearchListProps> = props => {
  const { currentUser, papers, searchQueryText, isLoading } = props;

  if (!papers || !searchQueryText) return null;

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  const searchItems = papers.map(paper => {
    return (
      <PaperItem
        key={paper.id}
        paper={paper}
        pageType="searchResult"
        actionArea="searchResult"
        searchQueryText={searchQueryText}
        currentUser={currentUser}
        wrapperClassName={styles.searchItemWrapper}
      />
    );
  });

  return <div className={styles.searchItems}>{searchItems}</div>;
};

export default withStyles<typeof SearchList>(styles)(SearchList);
