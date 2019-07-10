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

interface NoResultSearchContextProps {
  type: RELATED_PAPERS;
  paperShow: PaperShowState;
  queryParamsObject: PaperShowPageQueryParams;
  history: History;
  searchInput?: string;
}

interface ReferencePaperListProps extends NoResultSearchContextProps {
  papers: Paper[];
  currentUser: CurrentUser;
}

const NoResultSearchContext: React.FC<NoResultSearchContextProps> = props => {
  const { type, paperShow, searchInput, history, queryParamsObject } = props;
  const { paperId } = paperShow;

  const resetQuery = React.useCallback(
    () => {
      let pageQueryParams;

      if (type === 'reference') {
        pageQueryParams = { 'ref-query': '', 'ref-page': 1 };
      } else {
        pageQueryParams = { 'cited-query': '', 'cited-page': 1 };
      }

      history.push({
        pathname: `/papers/${paperId}`,
        search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
      });
    },
    [paperId]
  );

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

const ReferencePaperList: React.FC<ReferencePaperListProps> = props => {
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

  if (isPapersLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  if ((!papers || papers.length === 0) && totalPage === 0 && searchInput.length > 0)
    return (
      <NoResultSearchContext
        history={history}
        type={type}
        paperShow={paperShow}
        queryParamsObject={queryParamsObject}
        searchInput={searchInput}
      />
    );

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

export default withStyles<typeof ReferencePaperList>(styles)(ReferencePaperList);
