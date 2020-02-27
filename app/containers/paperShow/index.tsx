import React, { FC, useEffect } from 'react';
import useSWR from 'swr'
import { isEqual } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PaperShowMatchParams } from './types';
import { getPaper } from '../../api/paper';
import { AppState } from '../../reducers';
import { UserDevice } from '../../components/layouts/reducer';
import MobilePaperShow from '../../components/mobilePaperShow/mobilePaperShow';
import PaperShow from '../../components/paperShow';
import { getMemoizedPaper } from './select';
import ActionTicketManager from '../../helpers/actionTicketManager';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import { useFetchRefCitedPapers } from '../../hooks/useFetchRefCited';
import { Paper } from '../../model/paper';

type Props = RouteComponentProps<PaperShowMatchParams>;

const PaperShowContainer: FC<Props> = ({ location, match }) => {
  const initialPaper = useSelector<AppState, Paper | undefined>((state) => getMemoizedPaper(state), isEqual);
  const isMobile = useSelector((state: AppState) => state.layout.userDevice === UserDevice.MOBILE);
  const matchedPaperId = match.params.paperId;
  const queryParams = getQueryParamsObject(location.search);
  const refPage = queryParams['ref-page'];
  const refQuery = queryParams['ref-query'] || '';
  const refSort = queryParams['ref-sort'] || 'NEWEST_FIRST';
  const citedPage = queryParams['cited-page'];
  const citedQuery = queryParams['cited-query'] || '';
  const citedSort = queryParams['cited-sort'] || 'NEWEST_FIRST';

  useFetchRefCitedPapers({
    type: 'reference',
    paperId: matchedPaperId,
    page: refPage,
    query: refQuery,
    sort: refSort,
  });

  useFetchRefCitedPapers({
    type: 'cited',
    paperId: matchedPaperId,
    page: citedPage,
    query: citedQuery,
    sort: citedSort,
  });

  useEffect(() => {
    if (matchedPaperId) {
      ActionTicketManager.trackTicket({
        pageType: 'paperShow',
        actionType: 'view',
        actionArea: '200',
        actionTag: 'pageView',
        actionLabel: matchedPaperId,
      });
    }
  }, [matchedPaperId]);

  const initialData = (initialPaper && initialPaper.id === matchedPaperId) ? initialPaper : undefined;
  const { data: paper } = useSWR([`/papers/${matchedPaperId}`, matchedPaperId], (_url, id) => getPaper(id), {
    revalidateOnFocus: false,
    initialData,
  });

  if (!paper) return null;
  if (isMobile) return <MobilePaperShow paper={paper} />;
  return <PaperShow paper={paper} />;
};

export default withRouter(PaperShowContainer);
