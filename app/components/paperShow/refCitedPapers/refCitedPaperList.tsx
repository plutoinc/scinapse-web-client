import * as React from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import { isEqual } from 'lodash';
import { useHistory } from 'react-router-dom';
import { REF_CITED_CONTAINER_TYPE } from '../constants';
import ArticleSpinner from '../../common/spinner/articleSpinner';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import { getStringifiedUpdatedQueryParams } from './searchContainer';
import FullPaperItem from '../../common/paperItem/fullPaperItem';
import { AppState } from '../../../reducers';
import { paperSchema, Paper } from '../../../model/paper';
const styles = require('./referencePapers.scss');

interface RefCitedPaperListProps {
  type: REF_CITED_CONTAINER_TYPE;
  paperIds: string[];
  queryParamsObject: PaperShowPageQueryParams;
  isLoading: boolean;
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
  const history = useHistory();
  const { type, paperIds, queryParamsObject, isLoading } = props;
  const [searchInput, setSearchInput] = React.useState('');
  const refQuery = queryParamsObject['ref-query'] || '';
  const citedQuery = queryParamsObject['cited-query'] || '';

  React.useEffect(() => {
    setSearchInput(type === 'reference' ? refQuery : citedQuery);
  }, [refQuery, citedQuery, type]);

  const handleResetQuery = () => {
    let pageQueryParams;

    if (type === 'reference') {
      pageQueryParams = { 'ref-query': '', 'ref-page': 1 };
    } else {
      pageQueryParams = { 'cited-query': '', 'cited-page': 1 };
    }

    setSearchInput('');
    history.push({
      search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
    });
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <ArticleSpinner className={styles.loadingSpinner} />
      </div>
    );
  }

  if ((!paperIds || paperIds.length === 0) && searchInput.length > 0)
    return <NoResultSearchContext type={type} searchInput={searchInput} resetQuery={handleResetQuery} />;

  const referenceItems = paperIds.map(paperId => {
    return (
      <RefCitedPaperItem key={paperId} paperId={paperId} actionArea={type === 'reference' ? 'refList' : 'citedList'} />
    );
  });

  return <div className={styles.searchItems}>{referenceItems}</div>;
};

const RefCitedPaperItem: React.FC<{
  paperId: string;
  actionArea: Scinapse.ActionTicket.ActionArea;
}> = React.memo(({ paperId, actionArea }) => {
  const paper: Paper | null = useSelector(
    (state: AppState) => denormalize(paperId, paperSchema, state.entities),
    isEqual
  );

  if (!paper) return null;

  return <FullPaperItem pageType="paperShow" actionArea={actionArea} paper={paper} />;
});

export default withStyles<typeof RefCitedPaperList>(styles)(RefCitedPaperList);
