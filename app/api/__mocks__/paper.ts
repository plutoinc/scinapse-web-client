import { List } from "immutable";
import PlutoAxios from "../pluto";
import { PaperRecord, PaperFactory } from "../../model/paper";
import { GetPapersParams, GetPapersResult, GetRefOrCitedPapersParams } from "../types/paper";
import { RAW, RECORD } from "../../__mocks__";
import { GetPaperParams } from "../paper";

const mockGetPapersResult: GetPapersResult = {
  papers: List([RECORD.PAPER]),
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
  public async getPapers({ query }: GetPapersParams): Promise<GetPapersResult> {
    if (!query) {
      throw new Error("FAKE ERROR");
    } else if (query === "empty") {
      return { ...mockGetPapersResult, ...{ papers: List() } };
    } else {
      return mockGetPapersResult;
    }
  }

  public async getCitedPapers({ paperId }: GetRefOrCitedPapersParams): Promise<GetPapersResult> {
    if (!paperId) {
      throw new Error("FAKE ERROR");
    } else {
      return mockGetPapersResult;
    }
  }

  public async getReferencePapers({ paperId }: GetRefOrCitedPapersParams): Promise<GetPapersResult> {
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
