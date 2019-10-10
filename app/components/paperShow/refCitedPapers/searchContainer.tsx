import React from 'react';
import { stringify } from 'qs';
import { withRouter, RouteComponentProps } from 'react-router';
import ScinapseInput from '../../common/scinapseInput';
import { RELATED_PAPERS } from '../constants';
import SortBox, { AUTHOR_PAPER_LIST_SORT_TYPES } from '../../common/sortBox';
import { PaperShowPageQueryParams } from '../../../containers/paperShow/types';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
const styles = require('./referencePapers.scss');

type SearchContainerProps = RouteComponentProps<any> & {
  paperId: number;
  type: RELATED_PAPERS;
  queryParamsObject: PaperShowPageQueryParams;
  placeholder?: string;
};

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
  const { history, type, paperId, queryParamsObject, placeholder } = props;
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
    [queryParamsObject, type]
  );

  const handleSubmitSearch = React.useCallback(
    (query: string) => {
      ActionTicketManager.trackTicket({
        pageType: getCurrentPageType(),
        actionType: 'fire',
        actionArea: type,
        actionTag: 'query',
        actionLabel: query,
      });

      let pageQueryParams;
      if (type === 'reference') {
        pageQueryParams = { 'ref-query': query, 'ref-page': 1 };
      } else {
        pageQueryParams = { 'cited-query': query, 'cited-page': 1 };
      }

      history.push({
        pathname: `/papers/${paperId}`,
        search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
      });
    },
    [type, paperId, queryParamsObject, history]
  );

  const handleClickSortOption = React.useCallback(
    (sortOption: AUTHOR_PAPER_LIST_SORT_TYPES) => {
      let pageQueryParams;

      if (type === 'reference') {
        pageQueryParams = { 'ref-sort': sortOption };
      } else {
        pageQueryParams = { 'cited-sort': sortOption };
      }

      history.push({
        pathname: `/papers/${paperId}`,
        search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
      });
    },
    [type, paperId, queryParamsObject, history]
  );

  return (
    <div className={styles.searchContainer}>
      <ScinapseInput
        aria-label="Scinapse search box in paper show"
        value={searchInput}
        placeholder={placeholder || 'Search papers'}
        icon="SEARCH_ICON"
        onSubmit={handleSubmitSearch}
      />
      <div className={styles.sortBoxContainer}>
        <SortBox
          onClickOption={handleClickSortOption}
          sortOption={sortOption}
          currentPage="paperShow"
          exposeRelevanceOption={false}
        />
      </div>
    </div>
  );
};

export default withRouter(SearchContainer);
