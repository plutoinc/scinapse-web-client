import { List } from "immutable";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface CompletionKeyword {
  keyword: string;
  type: string;
}

export const initialCompletionKeyword: CompletionKeyword = {
  keyword: null,
  type: null,
};

export interface CompletionKeywordRecord extends TypedRecord<CompletionKeywordRecord>, CompletionKeyword {}
export interface CompletionKeywordList extends List<CompletionKeywordRecord> {}

export const CompletionKeywordFactory = makeTypedFactory<CompletionKeyword, CompletionKeywordRecord>(
  initialCompletionKeyword,
);

export const CompletionKeywordKListFactory = (completionKeywordArray: CompletionKeyword[] = []) => {
  return List(completionKeywordArray.map(keyword => CompletionKeywordFactory(keyword)));
};
