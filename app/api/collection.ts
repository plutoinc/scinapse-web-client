import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Collection, collectionSchema } from "../model/collection";

export interface PostCollectionParams {
  title: string;
  description: string;
}

interface AddPaperToCollectionsParams {
  collectionIds: number[];
  paperId: number;
  note?: string;
}

class CollectionAPI extends PlutoAxios {
  public async addPaperToCollections(
    params: AddPaperToCollectionsParams
  ): Promise<{ success: true }> {
    const res = await this.post("/collections/papers", {
      collection_ids: params.collectionIds,
      paper_id: params.paperId,
      note: params.note
    });

    return res.data;
  }

  public async getCollection(
    collectionId: number
  ): Promise<{
    entities: { collections: { [collectionId: number]: Collection } };
    result: number;
  }> {
    const res = await this.get(`/collections/${collectionId}`);
    const noramlizedData = normalize(res.data, collectionSchema);
    return noramlizedData;
  }

  public async postCollection({
    title,
    description
  }: PostCollectionParams): Promise<{
    entities: { collections: { [collectionId: number]: Collection } };
    result: number;
  }> {
    const res = await this.post("/collections", {
      title,
      description
    });

    const normalizedData = normalize(res.data.data, collectionSchema);

    return normalizedData;
  }
}

const collectionAPI = new CollectionAPI();

export default collectionAPI;
