import { CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { CommonPaginationResponsePart, RawPaginationResponseV2 } from "./types/common";
import { Collection, collectionSchema } from "../model/collection";
import { memberSchema, Member } from "../model/member";
import { camelCaseKeys } from "../helpers/camelCaseKeys";

export interface GetCollectionsResponse extends CommonPaginationResponsePart {
  content: Collection[];
  entities: { collections: { [collectionId: number]: Collection } };
  result: number[];
}

interface Filter {
  name: string;
  emoji: string;
  filter: string;
}

interface GetFiltersResponse extends RawPaginationResponseV2<Filter[]> {}

class MemberAPI extends PlutoAxios {
  public async getMember(
    memberId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { members: { [memberId: number]: Member } };
    result: number;
  }> {
    const res = await this.get(`/members/${memberId}`, { cancelToken });
    const camelizedRes = camelCaseKeys(res.data);
    const normalizedMember = normalize(camelizedRes, memberSchema);
    return normalizedMember;
  }

  public async getCollections(memberId: number, cancelToken?: CancelToken): Promise<GetCollectionsResponse> {
    const res = await this.get(`/members/${memberId}/collections`, { cancelToken });
    const camelizedRes = camelCaseKeys(res.data.data);
    const normalizedCollections = normalize(camelizedRes.content, [collectionSchema]);
    return { ...camelizedRes, ...normalizedCollections };
  }

  public async getMyCollections(paperId: number, cancelToken: CancelToken): Promise<GetCollectionsResponse> {
    const res = await this.get(`/members/me/collections`, {
      params: {
        paper_id: paperId,
      },
      cancelToken,
    });
    const camelizedRes = camelCaseKeys(res.data.data);
    const normalizedCollections = normalize(camelizedRes.content, [collectionSchema]);

    return { ...camelizedRes, ...normalizedCollections };
  }

  public async getMyFilters(): Promise<GetFiltersResponse> {
    const res = await this.get(`/member/me/saved-filters`);
    const camelizedRes = camelCaseKeys(res.data);
    console.log(camelizedRes);
    const normalizedCollections = normalize(camelizedRes.content, [collectionSchema]);

    return { ...camelizedRes, ...normalizedCollections };
  }

  public async addMyFilters(params: Filter) {
    console.log({
      saved_filters: [params],
    });
    const res = await this.put(`/member/me/saved-filters`, {
      saved_filters: [params],
    });

    console.log(res);
    return res.data;
  }
}

const memberAPI = new MemberAPI();

export default memberAPI;
