import React, { FC, useEffect } from 'react';
import useSWR from 'swr'
import { isEqual } from 'lodash';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PaperShowMatchParams } from './types';
import { AppState } from '../../reducers';
import { UserDevice } from '../../components/layouts/reducer';
import MobilePaperShow from '../../components/mobilePaperShow/mobilePaperShow';
import PaperShow from '../../components/paperShow';
import { getMemoizedPaper } from './select';
import ActionTicketManager from '../../helpers/actionTicketManager';
import getQueryParamsObject from '../../helpers/getQueryParamsObject';
import { useFetchRefCitedPapers } from '../../hooks/useFetchRefCited';
import { getAxiosInstance } from '../../api/axios';

type Props = RouteComponentProps<PaperShowMatchParams>;

const PaperShowContainer: FC<Props> = ({ location, match, history }) => {
  const shouldFetch = useSelector(
    (state: AppState) => !state.configuration.succeedAPIFetchAtServer || state.configuration.renderedAtClient
  );

  const initialPaper = useSelector((state: AppState) => getMemoizedPaper(state), isEqual);
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


  async function getPaper(id: string) {
    console.log('called');
    const res = await getAxiosInstance().get(`/papers/${id}`);
    return res.data;
  }

  console.log('matchedPaperId === ', matchedPaperId)
  const { data: paper } = useSWR([`/papers/${matchedPaperId}`, matchedPaperId], (_url, id) => getPaper(id), {
    revalidateOnFocus: false,
    initialData: initialPaper.id === matchedPaperId && initialPaper,
  });


  if (!paper) return null;

  if (isMobile) return <MobilePaperShow paper={paper} />;

  return <PaperShow paper={paper} />;
};

export default withRouter(PaperShowContainer);
