import { range } from 'lodash';

interface MockEventPaginationProps {
  type: string;
  currentPageIndex: number;
  totalPage: number;
  onItemClick: (page: number) => void;
}

function makePageNumberArrayInTest(props: MockEventPaginationProps): number[] {
  const totalPage = props.totalPage;
  const currentPage = props.currentPageIndex + 1;

  let startPage: number;
  let endPage: number;

  if (currentPage - 5 <= 1) {
    startPage = 1;
    endPage = totalPage >= 10 ? 10 + 1 : totalPage + 1;
  } else if (totalPage > currentPage + 5) {
    startPage = currentPage - 5;
    endPage = currentPage + 5;
  } else {
    startPage = totalPage - 6;
    endPage = totalPage + 1;
  }

  return range(startPage, endPage);
}

describe('DesktopPagination', () => {
  describe('makePageNumberArray function', () => {
    describe('when totalPage is less than 10', () => {
      let mockPagination: MockEventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: 'event',
          currentPageIndex: 0,
          totalPage: 8,
          onItemClick: () => {},
        };
      });

      it('should return 1~8 range result', () => {
        console.log(makePageNumberArrayInTest(mockPagination));
        expect(makePageNumberArrayInTest(mockPagination)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      });
    });

    describe('when totalPage is more than 10 and current page is 1', () => {
      let mockPagination: MockEventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: 'event',
          currentPageIndex: 0,
          totalPage: 13,
          onItemClick: () => {},
        };
      });

      it('should return 1~10 range result', () => {
        console.log(makePageNumberArrayInTest(mockPagination));
        expect(makePageNumberArrayInTest(mockPagination)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    });

    describe('when totalPage is more than (10 + current page + 4) and current page is more than 7', () => {
      let mockPagination: MockEventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: 'event',
          currentPageIndex: 6,
          totalPage: 15,
          onItemClick: () => {},
        };
      });

      it('should return 2~11 range result', () => {
        expect(makePageNumberArrayInTest(mockPagination)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      });
    });

    describe('when totalPage is more than (10 + current page + 4) and current page is more than 13', () => {
      let mockPagination: MockEventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: 'event',
          currentPageIndex: 12,
          totalPage: 27,
          onItemClick: () => {},
        };
      });

      it('should return 8~17 range result', () => {
        expect(makePageNumberArrayInTest(mockPagination)).toEqual([8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
      });
    });

    describe('when totalPage is less than (10 + current page + 4) and current page is more than 13', () => {
      let mockPagination: MockEventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: 'event',
          currentPageIndex: 10,
          totalPage: 17,
          onItemClick: () => {},
        };
      });

      it('should return 6~15 range result', () => {
        expect(makePageNumberArrayInTest(mockPagination)).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      });
    });
  });
});
