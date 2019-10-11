import React, { FC, useCallback, useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import ArticleSpinner from '../../common/spinner/articleSpinner';
import { REF_CITED_CONTAINER_TYPE } from '../constants';
import MobilePaperShowItem from '../../mobilePaperShowItem/mobilePaperShowItem';
import RefCitedPagination from './refCitedPagination';
import { AppState } from '../../../reducers';
import ScinapseInput from '../../common/scinapseInput';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { PaperShowMatchParams } from '../../../containers/paperShow/types';
import { getStringifiedUpdatedQueryParams } from './searchContainer';
import SortBox, { PAPER_LIST_SORT_TYPES } from '../../common/sortBox';
import getQueryParamsObject from '../../../helpers/getQueryParamsObject';

const s = require('./mobileRefCitedPapers.scss');
const useStyles = require('isomorphic-style-loader/useStyles');

type Props = RouteComponentProps<PaperShowMatchParams> & {
  type: REF_CITED_CONTAINER_TYPE;
  paperCount: number;
  parentPaperId: number;
};

const MobileRefCitedPapers: FC<Props> = ({ type, parentPaperId, paperCount, history, location }) => {
  useStyles(s);
  const paperIds: number[] = useSelector((state: AppState) => {
    return type === 'reference' ? state.paperShow.referencePaperIds : state.paperShow.citedPaperIds;
  }, isEqual);
  const isLoading = useSelector((state: AppState) => {
    return type === 'reference' ? state.paperShow.isLoadingReferencePapers : state.paperShow.isLoadingCitedPapers;
  });

  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState<PAPER_LIST_SORT_TYPES>('NEWEST_FIRST');

  const queryParamsObject = getQueryParamsObject(location.search);
  useEffect(
    () => {
      if (type === 'reference') {
        setSortOption(queryParamsObject['ref-sort'] || 'NEWEST_FIRST');
        setQuery(queryParamsObject['ref-query'] || '');
      } else if (type === 'cited') {
        setSortOption(queryParamsObject['cited-sort'] || 'NEWEST_FIRST');
        setQuery(queryParamsObject['cited-query'] || '');
      }
    },
    [queryParamsObject, type]
  );

  const handleSubmitSearch = useCallback(
    (query: string) => {
      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
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
        pathname: `/papers/${parentPaperId}`,
        search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
      });
    },
    [type, parentPaperId, queryParamsObject, history]
  );

  const handleClickSortOption = useCallback(
    (sortOption: PAPER_LIST_SORT_TYPES) => {
      let pageQueryParams;

      if (type === 'reference') {
        pageQueryParams = { 'ref-sort': sortOption };
      } else {
        pageQueryParams = { 'cited-sort': sortOption };
      }

      history.push({
        pathname: `/papers/${parentPaperId}`,
        search: getStringifiedUpdatedQueryParams(queryParamsObject, pageQueryParams),
      });
    },
    [type, parentPaperId, queryParamsObject, history]
  );

  if (!paperIds) return null;

  const title = type === 'reference' ? `References (${paperCount || 0})` : `Citations (${paperCount || 0})`;
  const placeholder = type === 'reference' ? 'Search papers in references' : 'Search papers in citations';

  if (isLoading) {
    return (
      <div className={s.loadingSection}>
        <ArticleSpinner />
      </div>
    );
  }

  if (paperIds.length === 0) {
    return (
      <div className={s.titleWrapper}>
        <div className={s.title}>{title}</div>
      </div>
    );
  }

  return (
    <>
      <div className={s.titleWrapper}>
        <div className={s.title}>{title}</div>
        <SortBox
          onClickOption={handleClickSortOption}
          sortOption={sortOption}
          currentPage="paperShow"
          exposeRelevanceOption={false}
        />
      </div>
      <ScinapseInput
        value={query}
        aria-label="Scinapse search box in paper show"
        placeholder={placeholder}
        icon="SEARCH_ICON"
        onSubmit={handleSubmitSearch}
        inputStyle={{
          backgroundColor: 'white',
          padding: '16px 48px 16px 16px',
        }}
        wrapperStyle={{ marginBottom: '12px' }}
        iconStyle={{ right: '20px' }}
      />
      {paperIds.map(id => (
        <MobilePaperShowItem
          key={id}
          className={s.itemWrapper}
          paperId={id}
          pageType="paperShow"
          actionArea={type === 'reference' ? 'refList' : 'citedList'}
        />
      ))}
      <RefCitedPagination type={type} paperId={parentPaperId} isMobile />
    </>
  );
};

export default withRouter(MobileRefCitedPapers);
