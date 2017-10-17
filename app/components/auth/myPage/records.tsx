import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

// Category Types
export enum MY_PAGE_CATEGORY_TYPE {
  ARTICLE,
  EVALUATION,
  WALLET,
  SETTING,
}

export interface IMyPageState {
  isLoading: boolean;
  hasError: boolean;
  category: MY_PAGE_CATEGORY_TYPE;
}

export interface IMyPageStateRecord extends TypedRecord<IMyPageStateRecord>, IMyPageState {}

const initialMyPageState = {
  isLoading: false,
  hasError: false,
  category: MY_PAGE_CATEGORY_TYPE.WALLET,
};

export const MyPageStateFactory = makeTypedFactory<IMyPageState, IMyPageStateRecord>(initialMyPageState);

export const MY_PAGE_INITIAL_STATE = MyPageStateFactory();
