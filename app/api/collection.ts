import { CancelToken } from 'axios';
import { normalize } from 'normalizr';
import PlutoAxios from './pluto';
import { Collection, collectionSchema } from '../model/collection';
import { Paper } from '../model/paper';
import { PaperInCollection, paperInCollectionSchema } from '../model/paperInCollection';
import { AUTHOR_PAPER_LIST_SORT_TYPES } from '../components/common/sortBox';
import { DEFAULT_AUTHOR_PAPERS_SIZE } from './author';
import { NormalizedDataWithPaginationV2, PaginationResponseV2 } from './types/common';
import { getIdSafePaper, getSafeCollection } from '../helpers/getIdSafeData';

export interface UpdatePaperNoteToCollectionParams {
  paperId: string;
  collectionId: number;
  note: string | null;
}

export interface PostCollectionParams {
  title: string;
  description: string;
}

export interface UpdateCollectionParams {
  collectionId: number;
  title: string;
  description: string;
}

export interface AddPaperToCollectionParams {
  collection: Collection;
  paperId: string;
  note?: string;
  cancelToken?: CancelToken;
}

export interface RemovePapersFromCollectionParams {
  collection: Collection;
  paperIds: string[];
  cancelToken?: CancelToken;
}

export interface GetCollectionsPapersParams {
  collectionId: number;
  page: number;
  sort: AUTHOR_PAPER_LIST_SORT_TYPES;
  cancelToken: CancelToken;
  query?: string;
  size?: number;
}

interface UpdatePaperNoteResponse {
  note: string;
  paper: null;
  collectionId: number;
  paperId: string;
}

interface CollectionAPIGetPapersResult
  extends NormalizedDataWithPaginationV2<{
      papersInCollection: {
        [paperId: string]: PaperInCollection;
      };
    }> {}

class CollectionAPI extends PlutoAxios {
  public async getPapers(params: GetCollectionsPapersParams): Promise<CollectionAPIGetPapersResult> {
    const res = await this.get(`/collections/${params.collectionId}/papers`, {
      params: {
        q: params.query || null,
        page: params.page - 1,
        size: params.size || DEFAULT_AUTHOR_PAPERS_SIZE,
        sort: params.sort,
      },
      cancelToken: params.cancelToken,
    });

    const resData: PaginationResponseV2<PaperInCollection[]> = res.data;
    const paperInfoList = resData.data.content.map(paperInfo => ({
      ...paperInfo,
      paper: getIdSafePaper(paperInfo.paper),
      paperId: String(paperInfo.paperId),
    }));

    const normalizedData = normalize(paperInfoList, [paperInCollectionSchema]);

    return {
      entities: normalizedData.entities,
      result: normalizedData.result,
      page: { ...resData.data.page!, page: resData.data.page!.page + 1 },
      error: resData.error,
    };
  }

  public async addPaperToCollection(params: AddPaperToCollectionParams): Promise<{ success: true }> {
    const res = await this.post(`/collections/${params.collection.id}/papers`, {
      paper_id: String(params.paperId),
      note: params.note,
    });

    return res.data;
  }

  public async removePapersFromCollection(params: RemovePapersFromCollectionParams): Promise<{ success: true }> {
    const paperString = params.paperIds.join(',');
    const res = await this.delete(`/collections/${params.collection.id}/papers`, {
      params: {
        paper_ids: paperString,
      },
    });

    return res.data;
  }

  public async updatePaperNoteToCollection(
    params: UpdatePaperNoteToCollectionParams
  ): Promise<UpdatePaperNoteResponse> {
    const res = await this.put(`/collections/${params.collectionId}/papers/${params.paperId}`, {
      note: params.note,
    });
    const updatedNote: UpdatePaperNoteResponse = res.data.data;

    return {
      ...updatedNote,
      paperId: String(updatedNote.paperId),
    };
  }

  public async getCollection(
    collectionId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { collections: { [collectionId: number]: Collection } };
    result: number;
  }> {
    const res = await this.get(`/collections/${collectionId}`, { cancelToken });
    const collection = getSafeCollection(res.data.data);
    return normalize(collection, collectionSchema);
  }

  public async postCollection({
    title,
    description,
  }: PostCollectionParams): Promise<{
    entities: { collections: { [collectionId: number]: Collection } };
    result: number;
  }> {
    const res = await this.post('/collections', {
      title,
      description,
    });
    const collection = getSafeCollection(res.data.data);
    const normalizedData = normalize(collection, collectionSchema);
    return normalizedData;
  }

  public async deleteCollection(collectionId: number): Promise<{ success: true }> {
    const res = await this.delete(`/collections/${collectionId}`);

    return res.data;
  }

  public async updateCollection(
    params: UpdateCollectionParams
  ): Promise<{
    entities: { collections: { [collectionId: number]: Collection } };
    result: number;
  }> {
    const res = await this.put(`/collections/${params.collectionId}`, {
      title: params.title,
      description: params.description,
    });
    const collection = getSafeCollection(res.data.data);
    const normalizedData = normalize(collection, collectionSchema);
    return normalizedData;
  }

  public async getRelatedPaperInCollection(collectionId: number): Promise<Paper[]> {
    const res = await this.get(`/collections/${collectionId}/related/sample`);
    const papers = res.data.data.content.map(getIdSafePaper);
    return papers;
  }
}

const collectionAPI = new CollectionAPI();

export default collectionAPI;
