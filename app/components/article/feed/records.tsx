import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IArticleFeedState {
  isLoading: boolean;
  hasError: boolean;
  isModalOpen: boolean;
}

export interface IArticleFeedStateRecord
  extends TypedRecord<IArticleFeedStateRecord>,
    IArticleFeedState {}

const initialArticleFeedState = {
  isLoading: false,
  hasError: false,
  isModalOpen: false
};

export const ArticleFeedStateFactory = makeTypedFactory<
  IArticleFeedState,
  IArticleFeedStateRecord
>(initialArticleFeedState);

export const ARTICLE_FEED_INITIAL_STATE = ArticleFeedStateFactory();
