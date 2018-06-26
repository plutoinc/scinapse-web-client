import PlutoAxios from "./pluto";
import { Collection } from "../model/collection";

interface PostCollectionParams {
  title: string;
  description: string;
}

class CollectionAPI extends PlutoAxios {
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
