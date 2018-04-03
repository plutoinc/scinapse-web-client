import { List } from "immutable";
import { PaginationResponse } from "../types/common";
import { GetMyBookmarksResponse } from "../member";
import { RECORD } from "../../__mocks__";

const PaginationResponse: GetMyBookmarksResponse = {
  content: List([RECORD.PAPER]),
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
  public async getMyBookmarks(): Promise<GetMyBookmarksResponse> {
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
