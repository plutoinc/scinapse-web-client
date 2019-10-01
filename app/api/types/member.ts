export interface KeywordSettingItemResponse {
  id: string;
  keyword: string;
  lastSendAt: Date;
}

export interface KeywordSettingsResponse {
  data: {
    content: KeywordSettingItemResponse[];
    page: null;
  };
  error: null;
}
