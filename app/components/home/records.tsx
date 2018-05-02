import { TypedRecord, recordify } from "typed-immutable-record";
import { CompletionKeywordList, CompletionKeyword, CompletionKeywordKListFactory } from "../../model/completion";

export interface HomeState {
  isKeywordCompletionOpen: boolean;
  isLoadingKeywordCompletion: boolean;
  completionKeywordList: CompletionKeyword[];
}

export interface HomeStatePart {
  isKeywordCompletionOpen: boolean;
  isLoadingKeywordCompletion: boolean;
  completionKeywordList: CompletionKeywordList;
}

export interface HomeStateRecord extends TypedRecord<HomeStateRecord>, HomeStatePart {}

export const initialHomeState: HomeState = {
  isKeywordCompletionOpen: false,
  isLoadingKeywordCompletion: false,
  completionKeywordList: [],
};

export const HomeStateFactory = (rawHomeState: HomeState = initialHomeState): HomeStateRecord => {
  return recordify({
    isKeywordCompletionOpen: rawHomeState.isKeywordCompletionOpen,
    isLoadingKeywordCompletion: rawHomeState.isLoadingKeywordCompletion,
    completionKeywordList: CompletionKeywordKListFactory(rawHomeState.completionKeywordList),
  });
};

export const HOME_INITIAL_STATE = HomeStateFactory();
