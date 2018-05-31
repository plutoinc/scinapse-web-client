import { PaginationResponse } from "../types/common";
import { RawGetMyBookmarksResponse } from "../member";
import { RAW } from "../../__mocks__";

const PaginationResponse: RawGetMyBookmarksResponse = {
  content: [
    {
      bookmarked: false,
      created_at: "2018-04-03T08:13:09.898",
      paper: RAW.PAPER,
      paper_id: 123,
    },
  ],
  totalElements: 1,
  last: true,
  totalPages: 1,
  sort: null,
  first: true,
  numberOfElements: 1,
  size: 10,
  number: 1,
};

class MemberAPI {
  public async getMyBookmarks(): Promise<RawGetMyBookmarksResponse> {
    return PaginationResponse;
  }

  public async postBookmark(paperId: number): Promise<{ success: boolean }> {
    if (!paperId) {
      throw new Error("Mock Error");
    }
    return { success: true };
  }
}

const memberAPI = new MemberAPI();

export default memberAPI;
