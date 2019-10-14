export type RecommendationActionTag =
  | 'paperShow'
  | 'copyDoi'
  | 'downloadPdf'
  | 'citePaper'
  | 'clickRequestFullTextBtn'
  | 'addToCollection'
  | 'source'
  | 'viewMorePDF';

export interface RecommendationActionAPIParams {
  paper_id: number;
  action: RecommendationActionTag;
}

export interface RecommendationActionParams {
  paperId: number;
  action: RecommendationActionTag;
}
