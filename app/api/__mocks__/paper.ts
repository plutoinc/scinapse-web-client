import { List } from "immutable";
import PlutoAxios from "../pluto";
import { IPaperRecord, recordifyPaper, initialPaper } from "../../model/paper";
import { IGetPapersParams, IGetPapersResult, IGetCitedPapersParams } from "../types/paper";

const mockGetPapersResult: IGetPapersResult = {
  papers: List(),
  first: true,
  last: true,
  number: 0,
  numberOfElements: 0,
  size: 0,
  sort: null,
  totalElements: 0,
  totalPages: 0,
};

class PaperAPI extends PlutoAxios {
  public async getPapers({ query }: IGetPapersParams): Promise<IGetPapersResult> {
    if (!query) {
      throw new Error("FAKE ERROR");
    } else {
      return mockGetPapersResult;
    }
  }

  public async getCitedPapers({ paperId }: IGetCitedPapersParams): Promise<IGetPapersResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return mockGetPapersResult;
    }
  }

  public async getReferencePapers({ paperId }: IGetCitedPapersParams): Promise<IGetPapersResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return mockGetPapersResult;
    }
  }

  public async getPaper(paperId: number): Promise<IPaperRecord> {
    if (!paperId) throw new Error("FAKE ERROR");
    const mockRawPaper = initialPaper;

    return recordifyPaper(mockRawPaper);
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
