import React from 'react';
import axios, { CancelTokenSource } from 'axios';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { CollectionShowState } from '../../containers/collectionShow/reducer';
import { LayoutState } from '../layouts/reducer';
import { getPapers } from '../../containers/collectionShow/actions';
import MobilePagination from '../common/mobilePagination';
import DesktopPagination from '../common/desktopPagination';
import { UserDevice } from '../layouts/reducer';

const Pagination: React.FC<{
  dispatch: Dispatch<any>;
  collectionShow: CollectionShowState;
  layout: LayoutState;
}> = ({ dispatch, collectionShow, layout }) => {
  const { currentPaperListPage, totalPaperListPage } = collectionShow;
  const cancelTokenSource = React.useRef<CancelTokenSource>(axios.CancelToken.source());

  const fetchPapers = React.useCallback(
    (page: number) => {
      dispatch(
        getPapers({
          collectionId: collectionShow.mainCollectionId,
          page,
          sort: collectionShow.sortType,
          cancelToken: cancelTokenSource.current.token,
          query: collectionShow.searchKeyword,
        })
      );

      return () => {
        cancelTokenSource.current.cancel();
        cancelTokenSource.current = axios.CancelToken.source();
      };
    },
    [collectionShow.mainCollectionId]
  );

  if (totalPaperListPage === 1) {
    return null;
  }

  const currentPageIndex: number = currentPaperListPage - 1;

  if (layout.userDevice !== UserDevice.DESKTOP) {
    return (
      <MobilePagination
        totalPageCount={totalPaperListPage}
        currentPageIndex={currentPageIndex}
        onItemClick={fetchPapers}
        wrapperStyle={{
          margin: '12px 0',
        }}
      />
    );
  } else {
    return (
      <DesktopPagination
        type="collection_show"
        totalPage={totalPaperListPage}
        currentPageIndex={currentPageIndex}
        onItemClick={fetchPapers}
        wrapperStyle={{
          margin: '24px 0',
        }}
      />
    );
  }
};

export default connect()(Pagination);
