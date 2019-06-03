import PlutoAxios from '../pluto';
import { SearchPapersParams, GetPapersResult, GetRefOrCitedPapersParams } from '../types/paper';
import { RAW } from '../../__mocks__';
import { GetPaperParams, GetCitationTextParams, GetCitationTextResult } from '../paper';
import { Paper } from '../../model/paper';

const mockGetPapersResult: GetPapersResult = {
  papers: [RAW.PAPER],
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
  public async getPapers({ query }: SearchPapersParams): Promise<GetPapersResult> {
    if (!query) {
      throw new Error('FAKE ERROR');
    } else if (query === 'empty') {
      return { ...mockGetPapersResult, ...{ papers: [] } };
    } else {
      return mockGetPapersResult;
    }
  }

  public async getCitedPapers({ paperId }: GetRefOrCitedPapersParams): Promise<GetPapersResult> {
    if (!paperId) {
      throw new Error('FAKE ERROR');
    } else {
      return mockGetPapersResult;
    }
  }

  public async getReferencePapers({ paperId }: GetRefOrCitedPapersParams): Promise<GetPapersResult> {
    if (!paperId) {
      throw new Error('FAKE ERROR');
    } else {
      return mockGetPapersResult;
    }
  }

  public async getPaper({ paperId }: GetPaperParams): Promise<Paper> {
    if (!paperId) {
      throw new Error('FAKE ERROR');
    }

    return RAW.PAPER;
  }

  public async getCitationText(params: GetCitationTextParams): Promise<GetCitationTextResult> {
    if (!params.paperId) {
      throw new Error('FAKE ERROR');
    }

    const mockResult = {
      data: {
        format: 'BIBTEX',
        citation_text:
          // tslint:disable-next-line:max-line-length
          '@article{Kirbach_2002,\n\tdoi = {10.1016/s0168-9002(01)01990-8},\n\turl = {https://doi.org/10.1016%2Fs0168-9002%2801%2901990-8},\n\tyear = 2002,\n\tmonth = {may},\n\tpublisher = {Elsevier {BV}},\n\tvolume = {484},\n\tnumber = {1-3},\n\tpages = {587--594},\n\tauthor = {U.W Kirbach and C.M Folden III and T.N Ginter and K.E Gregorich and D.M Lee and V Ninov and J.P Omtvedt and J.B Patin and N.K Seward and D.A Strellis and R Sudowe and A Türler and P.A Wilk and P.M Zielinski and D.C Hoffman and H Nitsche},\n\ttitle = {The Cryo-Thermochromatographic Separator ({CTS}):},\n\tjournal = {Nuclear Instruments and Methods in Physics Research Section A: Accelerators, Spectrometers, Detectors and Associated Equipment}\n}',
      },
    };

    return {
      citationText: mockResult.data.citation_text,
      format: mockResult.data.format,
    };
  }
}

const apiHelper = new PaperAPI();

export default apiHelper;
