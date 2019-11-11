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
  paper_id: string;
  action: RecommendationActionTag;
}

export interface RecommendationActionParams {
  paperId: string;
  action: RecommendationActionTag;
}
