import * as React from 'react';
import { ArticleSearchState } from '../../records';
import { withStyles } from '../../../../helpers/withStylesHelper';
import Icon from '../../../../icons';
import RequestPaperDialog from '../requestPaperDialog';
import NoResultContent from './noResultContent';
const styles = require('./noResult.scss');

interface NoResultProps {
  searchText: string;
  articleSearchState: ArticleSearchState;
  hasEmptyFilter: boolean;
}

const NoResult: React.FunctionComponent<NoResultProps> = props => {
  const { hasEmptyFilter, articleSearchState, searchText } = props;
  const { doiPatternMatched, doi } = articleSearchState;
  const [isOpen, setIsOpen] = React.useState(false);
  const query = props.articleSearchState.doiPatternMatched
    ? props.articleSearchState.doi
    : props.articleSearchState.searchInput;

  return (
    <div className={styles.articleSearchContainer}>
      <div className={styles.noPapersContainer}>
        <div className={styles.iconWrapper}>
          <Icon icon="NO_PAPER_RESULT" />
        </div>
        <div className={styles.noPapersContentWrapper}>
          <div className={styles.noPapersTitle}>Sorry</div>
          <div className={styles.noPapersContent}>
            <NoResultContent
              hasEmptyFilter={hasEmptyFilter}
              doiPatternMatched={doiPatternMatched}
              doi={doi}
              searchText={searchText}
              handleSetIsOpen={() => {
                setIsOpen(true);
              }}
            />
            <RequestPaperDialog
              isOpen={isOpen}
              query={query}
              onClose={() => {
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withStyles<typeof NoResult>(styles)(NoResult);
