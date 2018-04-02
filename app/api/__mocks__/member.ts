import { PaginationResponse } from "../types/common";

const PaginationResponse: PaginationResponse = {
  content: [],
  totalElements: 0,
  last: true,
  totalPages: 0,
  sort: null,
  first: true,
  numberOfElements: 0,
  size: 10,
  number: 0,
};

class MemberAPI {
  public async getMyBookmarks(): Promise<PaginationResponse> {
    return PaginationResponse;
  }
}

const memberAPI = new MemberAPI();

export default memberAPI;
