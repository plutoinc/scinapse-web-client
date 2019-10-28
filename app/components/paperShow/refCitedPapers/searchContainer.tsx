import React from 'react';
import { stringify } from 'qs';
import { withRouter, RouteComponentProps } from 'react-router';
import ScinapseInput from '../../common/scinapseInput';
import { REF_CITED_CONTAINER_TYPE } from '../constants';
import SortBox, { PAPER_LIST_SORT_TYPES } from '../../common/sortBox';
import { PaperShowPageQueryParams, PaperShowMatchParams } from '../../../containers/paperShow/types';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { getCurrentPageType } from '../../locationListener';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';
const styles = require('./referencePapers.scss');

type SearchContainerProps = RouteComponentProps<PaperShowMatchParams> & {
  type: REF_CITED_CONTAINER_TYPE;
  paperId: number;
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
  const { history, type, paperId, placeholder, location } = props;
  const [sortOption, setSortOption] = React.useState<PAPER_LIST_SORT_TYPES>('NEWEST_FIRST');
  const [searchInput, setSearchInput] = React.useState('');
  const queryParamsObject = getQueryParamsObject(location.search);

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
    (sortOption: PAPER_LIST_SORT_TYPES) => {
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
      <div className={styles.searchInputWrapper}>
        <ScinapseInput
          aria-label="Scinapse search box in paper show"
          value={searchInput}
          placeholder={placeholder || 'Search papers'}
          icon="SEARCH"
          onSubmit={handleSubmitSearch}
        />
      </div>
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
