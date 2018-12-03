import { CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { CommonPaginationResponsePart } from "./types/common";
import { Collection, collectionSchema } from "../model/collection";
import { memberSchema, Member } from "../model/member";

export interface GetCollectionsResponse extends CommonPaginationResponsePart {
  content: Collection[];
  entities: { collections: { [collectionId: number]: Collection } };
  result: number[];
}

class MemberAPI extends PlutoAxios {
  public async getMember(
    memberId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { members: { [memberId: number]: Member } };
    result: number;
  }> {
    const res = await this.get(`/members/${memberId}`, { cancelToken });

    const normalizedMember = normalize(res.data, memberSchema);

    return normalizedMember;
  }

  public async getCollections(memberId: number, cancelToken: CancelToken): Promise<GetCollectionsResponse> {
    const res = await this.get(`/members/${memberId}/collections`, { cancelToken });

    const normalizedCollections = normalize(res.data.data.content, [collectionSchema]);

    return { ...res.data.data, ...normalizedCollections };
  }

  public async getMyCollections(paperId?: number): Promise<GetCollectionsResponse> {
    const res = await this.get(`/members/me/collections`, {
      params: {
        paper_id: paperId,
      },
    });

    const normalizedCollections = normalize(res.data.data.content, [collectionSchema]);

    return { ...res.data.data, ...normalizedCollections };
  }
}

const memberAPI = new MemberAPI();

export default memberAPI;
