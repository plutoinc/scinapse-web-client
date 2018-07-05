import { normalize } from "normalizr";
import { Paper } from "../model/paper";
import PlutoAxios from "./pluto";
import { CommonPaginationResponsePart } from "./types/common";
import { RawBookmarkData, BookmarkData } from "../model/bookmark";
import { Collection, collectionSchema } from "../model/collection";
import { memberSchema, Member } from "../model/member";

export interface RawGetMyBookmarksResponse
  extends CommonPaginationResponsePart {
  content: RawBookmarkData[];
}

export interface GetMyBookmarkResponse extends CommonPaginationResponsePart {
  content: BookmarkData[];
}

interface CheckBookmarkedRawResponse {
  bookmarked: boolean;
  paper_id: number;
}

export interface CheckBookmarkedResponse {
  bookmarked: boolean;
  paperId: number;
}

export interface GetMyBookmarksParams {
  page: number;
  size: number;
}

export interface GetCollectionsResponse extends CommonPaginationResponsePart {
  content: Collection[];
  entities: { collections: { [collectionId: number]: Collection } };
  result: number[];
}

class MemberAPI extends PlutoAxios {
  public async getMember(
    memberId: number
  ): Promise<{
    entities: { members: { [memberId: number]: Member } };
    result: number;
  }> {
    const res = await this.get(`/members/${memberId}`);

    const normalizedMember = normalize(res.data, memberSchema);

    return normalizedMember;
  }

  public async getMyBookmarks(
    params: GetMyBookmarksParams
  ): Promise<GetMyBookmarkResponse> {
    const bookmarkResponse = await this.get("/members/me/bookmarks", {
      params: {
        size: params.size,
        page: params.page - 1
      }
    });

    const rawGetMyBookmarksResponse: RawGetMyBookmarksResponse =
      bookmarkResponse.data;
    const bookmarkData: BookmarkData[] = rawGetMyBookmarksResponse.content.map(
      bookmarkDatum => {
        return {
          bookmarked: bookmarkDatum.bookmarked,
          createdAt: bookmarkDatum.created_at,
          paper: bookmarkDatum.paper,
          paperId: bookmarkDatum.paper_id
        };
      }
    );

    return {
      ...rawGetMyBookmarksResponse,
      content: bookmarkData,
      number: rawGetMyBookmarksResponse.number + 1
    };
  }

  public async postBookmark(paper: Paper): Promise<{ succeed: true }> {
    const bookmarkResponse = await this.post("/members/me/bookmarks", {
      paper_id: paper.id
    });

    const response = bookmarkResponse.data;

    return response;
  }

  public async removeBookmark(paper: Paper): Promise<{ succeed: true }> {
    const bookmarkResponse = await this.delete("/members/me/bookmarks", {
      data: { paper_id: paper.id }
    });

    const response = bookmarkResponse.data;

    return response;
  }

  public async checkBookmarkedList(
    paperList: Paper[]
  ): Promise<CheckBookmarkedResponse[]> {
    const paperIds = paperList.map(paper => paper!.id).join(",");
    const checkedResponse = await this.get(
      `/members/me/bookmarks/check?paper_ids=${paperIds}`
    );
    const rawResponse: CheckBookmarkedRawResponse[] = checkedResponse.data.data;

    const bookmarkStatusArray = rawResponse.map(res => ({
      paperId: res.paper_id,
      bookmarked: res.bookmarked
    }));

    return bookmarkStatusArray;
  }

  public async checkBookmark(paper: Paper): Promise<CheckBookmarkedResponse[]> {
    const checkedResponse = await this.get(
      `/members/me/bookmarks/check?paper_ids=${paper.id}`
    );
    const rawResponse: CheckBookmarkedRawResponse[] = checkedResponse.data.data;

    return rawResponse.map(res => ({
      paperId: res.paper_id,
      bookmarked: res.bookmarked
    }));
  }

  public async getCollections(
    memberId: number
  ): Promise<GetCollectionsResponse> {
    const res = await this.get(`/members/${memberId}/collections`);

    const normalizedCollections = normalize(res.data.data.content, [
      collectionSchema
    ]);

    return { ...res.data.data, ...normalizedCollections };
  }

  public async getMyCollections(
    paperId?: number
  ): Promise<GetCollectionsResponse> {
    const res = await this.get(`/members/me/collections`, {
      params: {
        paper_id: paperId
      }
    });

    const normalizedCollections = normalize(res.data.data.content, [
      collectionSchema
    ]);

    return { ...res.data.data, ...normalizedCollections };
  }
}

const memberAPI = new MemberAPI();

export default memberAPI;
