export enum IMPORT_SOURCE_TAB {
  GS = 'GS',
  BIBTEX = 'BIBTEX',
  CITATION = 'CITATION',
  AUTHOR_URLS = 'AUTHOR_URLS',
}

export enum CURRENT_IMPORT_PROGRESS_STEP {
  PROGRESS,
  RESULT,
}

export interface HandleImportPaperListParams {
  type: IMPORT_SOURCE_TAB;
  importedContext: string | string[]
}