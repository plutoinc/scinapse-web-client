import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface SuggestionKeyword {
  keyword: string;
  suggestion: string;
  highlighted: string;
}

export const initialSuggestionKeyword: SuggestionKeyword = {
  keyword: "",
  suggestion: "",
  highlighted: "",
};

export interface SuggestionKeywordRecord extends TypedRecord<SuggestionKeywordRecord>, SuggestionKeyword {}

export const SuggestionKeywordFactory = makeTypedFactory<SuggestionKeyword, SuggestionKeywordRecord>(
  initialSuggestionKeyword,
);
