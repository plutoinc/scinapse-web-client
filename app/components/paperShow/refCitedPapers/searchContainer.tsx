import React from 'react';
import { stringify } from 'qs';
import { History } from 'history';
import { withStyles } from '../../../helpers/withStylesHelper';
import ScinapseInput from '../../common/scinapseInput';
import { RELATED_PAPERS } from '../constants';
import { PaperShowState } from '../../../containers/paperShow/records';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../common/sortBox';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
const styles = require('./referencePapers.scss');

interface SearchContainerProps {
  history: History;
  paperShow: PaperShowState;
  type: RELATED_PAPERS;
  queryParamsObject: PaperShowPageQueryParams;
}

export function getStringifiedUpdatedQueryParams(queryParamsObject: PaperShowPageQueryParams, pageQueryParams: any) {
  const updatedQueryParamsObject: PaperShowPageQueryParams = {
    ...queryParamsObject,
    ...pageQueryParams,
  };

  const stringifiedQueryParams = stringify(updatedQueryParamsObject, {
    addQueryPrefix: true,
  });

  return stringifiedQueryParams;
}

const SearchContainer: React.FC<SearchContainerProps> = props => {
  const { history, type, paperShow, queryParamsObject } = props;
  const [sortOption, setSortOption] = React.useState<AUTHOR_PAPER_LIST_SORT_TYPES>('NEWEST_FIRST');
  const [searchInput, setSearchInput] = React.useState('');

  React.useEffect(
    () => {
      if (type === 'reference') {
        setSortOption(queryParamsObject['ref-sort'] || 'NEWEST_FIRST');
        setSearchInput(queryParamsObject['ref-query'] || '');
      } else if (type === 'cited') {
        setSortOption(queryParamsObject['cited-sort'] || 'NEWEST_FIRST');
        setSearchInput(queryParamsObject['cited-query'] || '');
      }
    },
    [queryParamsObject]
  );

  const handleSubmitSearch = React.useCallback(
    (query: string) => {
      let pageQueryParams;

      if (type === 'reference') {
        pageQueryParams = { 'ref-query': query, 'ref-page': 1 };
      } else {
        pageQueryParams = { 'cited-query': query, 'cited-page': 1 };
      }

      history.push({
        pathname: `/papers/${paperShow.paperId}`,
        search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
      });
    },
    [queryParamsObject]
  );

  const getSortOptionChangeLink = React.useCallback(
    (sortOption: AUTHOR_PAPER_LIST_SORT_TYPES) => {
      let pageQueryParams;

      if (type === 'reference') {
        pageQueryParams = { 'ref-sort': sortOption };
      } else {
        pageQueryParams = { 'cited-sort': sortOption };
      }

      history.push({
        pathname: `/papers/${paperShow.paperId}`,
        search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
      });
    },
    [queryParamsObject]
  );

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <ScinapseInput
          aria-label="Scinapse search box in paper show"
          value={searchInput}
          onSubmit={handleSubmitSearch}
          placeholder="Search papers"
          icon="SEARCH_ICON"
        />
      </div>
      <div className={styles.sortBoxContainer}>
        <SortBox
          handleClickSortOption={getSortOptionChangeLink}
          sortOption={sortOption}
          currentPage="journalShow"
          exposeRelevanceOption={false}
        />
      </div>
    </div>
  );
};

export default withStyles<typeof SearchContainer>(styles)(SearchContainer);
