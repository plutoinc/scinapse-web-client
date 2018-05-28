import { List } from "immutable";
import { PaperRecord, Paper } from "../model/paper";
import PlutoAxios from "./pluto";
import { CommonPaginationResponsePart } from "./types/common";
import { RawBookmarkData, BookmarkDataList, BookmarkDataListFactory } from "../model/bookmark";

interface RawGetMyBookmarksResponse extends CommonPaginationResponsePart {
  content: RawBookmarkData[];
}

export interface GetMyBookmarksResponse extends CommonPaginationResponsePart {
  content: BookmarkDataList;
}

interface CheckBookmarkedRawResponse {
  bookmarked: boolean;
  paper_id: number;
}

export interface CheckBookmarkedResponse {
  bookmarked: boolean;
  paperId: number;
}

export interface CheckBookmarkedResponseList extends List<CheckBookmarkedResponse> {}

export interface GetMyBookmarksParams {
  page: number;
  size: number;
}

class MemberAPI extends PlutoAxios {
  public async getMyBookmarks(params: GetMyBookmarksParams): Promise<GetMyBookmarksResponse> {
    const bookmarkResponse = await this.get("/members/me/bookmarks", {
      params: {
        size: params.size,
        page: params.page - 1,
      },
    });

    const rawGetMyBookmarksResponse: RawGetMyBookmarksResponse = bookmarkResponse.data;
    const bookmarkDataList: BookmarkDataList = BookmarkDataListFactory(rawGetMyBookmarksResponse.content);

    return {
      ...rawGetMyBookmarksResponse,
      ...{ content: bookmarkDataList, number: rawGetMyBookmarksResponse.number + 1 },
    };
  }

  public async postBookmark(paper: PaperRecord | Paper): Promise<{ succeed: true }> {
    const bookmarkResponse = await this.post("/members/me/bookmarks", {
      paper_id: paper.id,
    });

    const response = bookmarkResponse.data;

    return response;
  }

  public async removeBookmark(paper: PaperRecord | Paper): Promise<{ succeed: true }> {
    const bookmarkResponse = await this.delete("/members/me/bookmarks", {
      data: { paper_id: paper.id },
    });

    const response = bookmarkResponse.data;

    return response;
  }

  public async checkBookmarkedList(
    paperList: List<PaperRecord | null | undefined>,
  ): Promise<CheckBookmarkedResponseList | undefined> {
    if (paperList && !paperList.isEmpty()) {
      const paperIds = paperList.map(paper => paper!.id).join(",");
      const checkedResponse = await this.get(`/members/me/bookmarks/check?paper_ids=${paperIds}`);
      const rawResponse: CheckBookmarkedRawResponse[] = checkedResponse.data.data;

      return List(
        rawResponse.map(res => ({
          paperId: res.paper_id,
          bookmarked: res.bookmarked,
        })),
      );
    }
  }

  // TODO: Remove PaperRecord from here
  public async checkBookmark(paper: PaperRecord | Paper): Promise<CheckBookmarkedResponse[]> {
    const checkedResponse = await this.get(`/members/me/bookmarks/check?paper_ids=${paper.id}`);
    const rawResponse: CheckBookmarkedRawResponse[] = checkedResponse.data.data;

    return rawResponse.map(res => ({
      paperId: res.paper_id,
      bookmarked: res.bookmarked,
    }));
  }
}

const memberAPI = new MemberAPI();

export default memberAPI;
