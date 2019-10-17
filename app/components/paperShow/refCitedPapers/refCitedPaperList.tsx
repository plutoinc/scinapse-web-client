import * as React from 'react';
import { History } from 'history';
import { Paper } from '../../../model/paper';
import { REF_CITED_CONTAINER_TYPE } from '../constants';
import ArticleSpinner from '../../common/spinner/articleSpinner';
import Icon from '../../../icons';
import MediumPaperItem from '../../common/paperItem/mediumPaperItem';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import { PaperShowState } from '../../../containers/paperShow/records';
import { getStringifiedUpdatedQueryParams } from './searchContainer';
const styles = require('./referencePapers.scss');

interface RefCitedPaperListProps {
  history: History;
  type: REF_CITED_CONTAINER_TYPE;
  papers: Paper[];
  paperShow: PaperShowState;
  queryParamsObject: PaperShowPageQueryParams;
}

interface NoResultSearchContextProps {
  type: REF_CITED_CONTAINER_TYPE;
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
  const { history, type, papers, paperShow, queryParamsObject } = props;
  const [searchInput, setSearchInput] = React.useState('');
  const refQuery = queryParamsObject['ref-query'] || '';
  const citedQuery = queryParamsObject['cited-query'] || '';

  React.useEffect(
    () => {
      setSearchInput(type === 'reference' ? refQuery : citedQuery);
    },
    [refQuery, citedQuery, type]
  );

  const handleResetQuery = () => {
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
  };

  const isLoading = type === 'reference' ? paperShow.isLoadingReferencePapers : paperShow.isLoadingCitedPapers;
  const totalPage = type === 'reference' ? paperShow.referencePaperTotalPage : paperShow.citedPaperTotalPage;

  if (isLoading) {
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
      <MediumPaperItem
        key={paper.id}
        pageType="paperShow"
        actionArea={type === 'reference' ? 'refList' : 'citedList'}
        paper={paper}
      />
    );
  });

  return <div className={styles.searchItems}>{referenceItems}</div>;
};

export default withStyles<typeof RefCitedPaperList>(styles)(RefCitedPaperList);
