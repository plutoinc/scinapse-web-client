import { List } from "immutable";
import PlutoAxios from "../pluto";
import { PaperRecord, PaperFactory } from "../../model/paper";
import { IGetPapersParams, IGetPapersResult, IGetRefOrCitedPapersParams } from "../types/paper";
import { RAW } from "../../__mocks__";
import { GetPaperParams } from "../paper";

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

  public async getCitedPapers({ paperId }: IGetRefOrCitedPapersParams): Promise<IGetPapersResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return mockGetPapersResult;
    }
  }

  public async getReferencePapers({ paperId }: IGetRefOrCitedPapersParams): Promise<IGetPapersResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return mockGetPapersResult;
    }
  }

  public async getPaper({ paperId }: GetPaperParams): Promise<PaperRecord> {
    if (!paperId) throw new Error("FAKE ERROR");

    return PaperFactory(RAW.PAPER);
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
