import React from 'react';
import { History } from 'history';
import { RELATED_PAPERS } from '../constants';
import { PaperShowState } from '../../../containers/paperShow/records';
import DesktopPagination from '../../common/desktopPagination';
import MobilePagination from '../../common/mobilePagination';

interface RefCitedPapersPaginationProps {
  isMobile: boolean;
  type: RELATED_PAPERS;
  paperShow: PaperShowState;
  handleGetPaginationLink: (page: number) => History.LocationDescriptor<any>;
}

const RefCitedPagination: React.FC<RefCitedPapersPaginationProps> = props => {
  const { isMobile, paperShow, type, handleGetPaginationLink } = props;
  let totalPage;
  let currentPage;

  if (type === 'reference') {
    totalPage = paperShow.referencePaperTotalPage;
    currentPage = paperShow.referencePaperCurrentPage;
  } else {
    totalPage = paperShow.citedPaperTotalPage;
    currentPage = paperShow.citedPaperCurrentPage;
  }

  if (isMobile) {
    return (
      <MobilePagination
        totalPageCount={totalPage}
        currentPageIndex={currentPage - 1}
        getLinkDestination={handleGetPaginationLink}
        wrapperStyle={{
          margin: '12px 0',
        }}
      />
    );
  } else {
    return (
      <DesktopPagination
        type={`paper_show_${type}_papers`}
        totalPage={totalPage}
        currentPageIndex={currentPage - 1}
        getLinkDestination={handleGetPaginationLink}
        wrapperStyle={{ margin: '32px 0 56px 0' }}
        actionArea={type === 'reference' ? 'refList' : 'citedList'}
      />
    );
  }
};

export default RefCitedPagination;
