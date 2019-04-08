import { EventPaginationProps, makePageNumberArray } from "..";

describe("DesktopPagination", () => {
  describe("makePageNumberArray function", () => {
    describe("when totalPage is less than 10", () => {
      let mockPagination: EventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: "event",
          currentPageIndex: 0,
          totalPage: 8,
          onItemClick: () => {},
        };
      });

      it("should return 1~8 range result", () => {
        console.log(makePageNumberArray(mockPagination));
        expect(makePageNumberArray(mockPagination)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      });
    });

    describe("when totalPage is more than 10 and current page is 1", () => {
      let mockPagination: EventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: "event",
          currentPageIndex: 0,
          totalPage: 13,
          onItemClick: () => {},
        };
      });

      it("should return 1~10 range result", () => {
        console.log(makePageNumberArray(mockPagination));
        expect(makePageNumberArray(mockPagination)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      });
    });

    describe("when totalPage is more than (10 + current page + 4) and current page is more than 7", () => {
      let mockPagination: EventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: "event",
          currentPageIndex: 6,
          totalPage: 15,
          onItemClick: () => {},
        };
      });

      it("should return 2~11 range result", () => {
        expect(makePageNumberArray(mockPagination)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
      });
    });

    describe("when totalPage is more than (10 + current page + 4) and current page is more than 13", () => {
      let mockPagination: EventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: "event",
          currentPageIndex: 12,
          totalPage: 27,
          onItemClick: () => {},
        };
      });

      it("should return 8~17 range result", () => {
        expect(makePageNumberArray(mockPagination)).toEqual([8, 9, 10, 11, 12, 13, 14, 15, 16, 17]);
      });
    });

    describe("when totalPage is less than (10 + current page + 4) and current page is more than 13", () => {
      let mockPagination: EventPaginationProps;
      beforeEach(() => {
        mockPagination = {
          type: "event",
          currentPageIndex: 10,
          totalPage: 17,
          onItemClick: () => {},
        };
      });

      it("should return 6~15 range result", () => {
        expect(makePageNumberArray(mockPagination)).toEqual([6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
      });
    });
  });
});
