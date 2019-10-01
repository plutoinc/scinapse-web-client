import { CancelToken } from 'axios';
import { normalize } from 'normalizr';
import PlutoAxios from './pluto';
import { CommonPaginationResponsePart } from './types/common';
import { Collection, collectionSchema } from '../model/collection';
import { memberSchema, Member } from '../model/member';
import { camelCaseKeys } from '../helpers/camelCaseKeys';
import { KeywordSettingsResponse } from './types/member';

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

  public async getKeywordSettings(): Promise<KeywordSettingsResponse> {
    const res = await this.get(`/members/me/alerts/keywords`);
    return camelCaseKeys(res.data);
  }

  public async newKeywordSettings(keyword: string): Promise<KeywordSettingsResponse> {
    const res = await this.post(`/members/me/alerts/keywords`, { keyword });
    return camelCaseKeys(res.data);
  }

  public async deleteKeywordSettings(keywordId: string): Promise<KeywordSettingsResponse> {
    const res = await this.delete(`/members/me/alerts/keywords/${keywordId}`);
    return camelCaseKeys(res.data);
  }
}

const memberAPI = new MemberAPI();

export default memberAPI;
