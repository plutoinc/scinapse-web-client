import PlutoAxios from "./pluto";
import { PaginationResponse } from "./types/common";

class MemberAPI extends PlutoAxios {
  public async getMyBookmarks(): Promise<PaginationResponse> {
    const bookmarkResponse = await this.get("/members/me/bookmarks");

    const response: PaginationResponse = bookmarkResponse.data;

    return response;
  }
}

const memberAPI = new MemberAPI();

export default memberAPI;
