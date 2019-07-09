import * as React from 'react';
import { Paper } from '../../../model/paper';
import { CurrentUser } from '../../../model/currentUser';
import { RELATED_PAPERS } from '../constants';
import ArticleSpinner from '../../common/spinner/articleSpinner';
import Icon from '../../../icons';
import PaperItem from '../../common/paperItem';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import { PaperShowState } from '../../../containers/paperShow/records';
const styles = require('./referencePapers.scss');

interface ReferencePaperListProps {
  type: RELATED_PAPERS;
  papers: Paper[];
  currentUser: CurrentUser;
  paperShow: PaperShowState;
  queryParamsObject: PaperShowPageQueryParams;
}

const ReferencePaperList: React.FC<ReferencePaperListProps> = props => {
  const { type, papers, currentUser, paperShow, queryParamsObject } = props;
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

  if ((!papers || papers.length === 0) && totalPage === 0 && searchInput)
    return (
      <div className={styles.noPaperWrapper}>
        <Icon icon="UFO" className={styles.ufoIcon} />
        <div className={styles.noPaperDescription}>
          Your search <b>{searchInput}</b> did not match any {type} papers.
        </div>
      </div>
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
