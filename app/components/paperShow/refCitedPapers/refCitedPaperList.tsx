import * as React from 'react';
import { History } from 'history';
import { Paper } from '../../../model/paper';
import { CurrentUser } from '../../../model/currentUser';
import { RELATED_PAPERS } from '../constants';
import ArticleSpinner from '../../common/spinner/articleSpinner';
import Icon from '../../../icons';
import PaperItem from '../../common/paperItem';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import { PaperShowState } from '../../../containers/paperShow/records';
import { getStringifiedUpdatedQueryParams } from './searchContainer';
const styles = require('./referencePapers.scss');

interface RefCitedPaperListProps {
  history: History;
  type: RELATED_PAPERS;
  papers: Paper[];
  currentUser: CurrentUser;
  paperShow: PaperShowState;
  queryParamsObject: PaperShowPageQueryParams;
}

interface NoResultSearchContextProps {
  type: RELATED_PAPERS;
  searchInput: string;
  resetQuery: () => void;
}

const NoResultSearchContext: React.FC<NoResultSearchContextProps> = props => {
  const { type, searchInput, resetQuery } = props;

  return (
    <div className={styles.noPaperWrapper}>
      <Icon icon="UFO" className={styles.ufoIcon} />
      <div className={styles.noPaperDescription}>
        Your search <b>{searchInput}</b> did not match any {type} papers.
      </div>
      <button className={styles.reloadBtn} onClick={resetQuery}>
        <Icon icon="RELOAD" className={styles.reloadIcon} />
        Reload {type} papers
      </button>
    </div>
  );
};

const RefCitedPaperList: React.FC<RefCitedPaperListProps> = props => {
  const { history, type, papers, currentUser, paperShow, queryParamsObject } = props;
  const [totalPage, setTotalPage] = React.useState(0);
  const [isPapersLoading, setIsPapersLoading] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState('');

  React.useEffect(
    () => {
      if (type === 'reference') {
        setTotalPage(paperShow.referencePaperTotalPage);
        setIsPapersLoading(paperShow.isLoadingReferencePapers);
        setSearchInput(queryParamsObject['ref-query'] || '');
      } else if (type === 'cited') {
        setTotalPage(paperShow.citedPaperTotalPage);
        setIsPapersLoading(paperShow.isLoadingCitedPapers);
        setSearchInput(queryParamsObject['cited-query'] || '');
      }
    },
    [paperShow, queryParamsObject]
  );

  const handleResetQuery = React.useCallback(
    () => {
      let pageQueryParams;

      if (type === 'reference') {
        pageQueryParams = { 'ref-query': '', 'ref-page': 1 };
      } else {
        pageQueryParams = { 'cited-query': '', 'cited-page': 1 };
      }

      setSearchInput('');
      history.push({
        pathname: `/papers/${paperShow.paperId}`,
        search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
      });
    },
    [paperShow.paperId]
  );

  if (isPapersLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  if ((!papers || papers.length === 0) && totalPage === 0 && searchInput.length > 0)
    return <NoResultSearchContext type={type} searchInput={searchInput} resetQuery={handleResetQuery} />;

  const referenceItems = papers.map(paper => {
    return (
      <div className={styles.paperShowPaperItemWrapper} key={paper.id}>
        <PaperItem
          pageType="paperShow"
          actionArea={type === 'reference' ? 'refList' : 'citedList'}
          currentUser={currentUser}
          paper={paper}
          wrapperStyle={{ borderBottom: 'none', marginBottom: 0, paddingBottom: 0, maxWidth: '100%' }}
        />
      </div>
    );
  });

  return <div className={styles.searchItems}>{referenceItems}</div>;
};

export default withStyles<typeof RefCitedPaperList>(styles)(RefCitedPaperList);
