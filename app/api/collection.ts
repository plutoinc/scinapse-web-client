import { normalize } from "normalizr";
import PlutoAxios from "./pluto";
import { Collection, collectionSchema } from "../model/collection";

interface PostCollectionParams {
  title: string;
  description: string;
}

class CollectionAPI extends PlutoAxios {
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
  }: PostCollectionParams): Promise<Collection> {
    const res = await this.post("/collections", {
      title,
      description
    });

    return res.data as Collection;
  }
}

const collectionAPI = new CollectionAPI();

export default collectionAPI;
