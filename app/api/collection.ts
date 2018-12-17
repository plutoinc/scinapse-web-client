import { CancelToken } from "axios";
import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Collection, collectionSchema } from "../model/collection";
import { Paper } from "../model/paper";
import { PaperInCollection, paperInCollectionSchema } from "../model/paperInCollection";

export interface UpdatePaperNoteToCollectionParams {
  paperId: number;
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
  paperId: number;
  note?: string;
}

export interface RemovePapersFromCollectionParams {
  collection: Collection;
  paperIds: number[];
}

interface RawCollectionPaperListResponse {
  note: string | null;
  collection_id: number;
  paper_id: number;
  paper: Paper;
}

interface RawUpdatePaperNoteResponse {
  note: string;
  paper: null;
  collection_id: number;
  paper_id: number;
}

interface CollectionAPIGetPapersResult {
  entities: { papersInCollection: { [paper_id: number]: PaperInCollection } };
  result: number[];
}

class CollectionAPI extends PlutoAxios {
  public async getPapers(collectionId: number, cancelToken: CancelToken): Promise<CollectionAPIGetPapersResult> {
    const res = await this.get(`/collections/${collectionId}/papers`, { cancelToken });

    const resData: RawCollectionPaperListResponse[] = res.data.data;

    // Validation
    resData.forEach(datum => {
      if (
        !datum.hasOwnProperty("note") ||
        !datum.hasOwnProperty("collection_id") ||
        !datum.hasOwnProperty("paper_id") ||
        !datum.hasOwnProperty("paper")
      ) {
        console.log("ERROR");
        throw new Error("Collection API's getPapers method is broken.");
      }
    });
    const normalizedData = normalize(resData, [paperInCollectionSchema]);
    return normalizedData;
  }

  public async addPaperToCollection(params: AddPaperToCollectionParams): Promise<{ success: true }> {
    const res = await this.post(`/collections/${params.collection.id}/papers`, {
      paper_id: params.paperId,
      note: params.note,
    });

    return res.data;
  }

  public async removePapersFromCollection(params: RemovePapersFromCollectionParams): Promise<{ success: true }> {
    const paperString = params.paperIds.join(",");
    const res = await this.delete(`/collections/${params.collection.id}/papers`, {
      params: {
        paper_ids: paperString,
      },
    });

    return res.data;
  }

  public async updatePaperNoteToCollection(params: UpdatePaperNoteToCollectionParams) {
    const res = await this.put(`/collections/${params.collectionId}/papers/${params.paperId}`, {
      note: params.note,
    });
    const rawResData: RawUpdatePaperNoteResponse = res.data.data;
    return rawResData;
  }

  public async getCollection(
    collectionId: number,
    cancelToken: CancelToken
  ): Promise<{
    entities: { collections: { [collectionId: number]: Collection } };
    result: number;
  }> {
    const res = await this.get(`/collections/${collectionId}`, { cancelToken });
    const normalizedData = normalize(res.data.data, collectionSchema);

    return normalizedData;
  }

  public async postCollection({
    title,
    description,
  }: PostCollectionParams): Promise<{
    entities: { collections: { [collectionId: number]: Collection } };
    result: number;
  }> {
    const res = await this.post("/collections", {
      title,
      description,
    });

    const normalizedData = normalize(res.data.data, collectionSchema);

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

    const normalizedData = normalize(res.data.data, collectionSchema);

    return normalizedData;
  }
}

const collectionAPI = new CollectionAPI();

export default collectionAPI;
