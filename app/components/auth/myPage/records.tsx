import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IMyPageState {
  isLoading: boolean;
  isFailed: boolean;
  hasError: boolean;
  email: string;
  password: string;
}

export interface IMyPageStateRecord extends TypedRecord<IMyPageStateRecord>, IMyPageState {}

const initialMyPageState = {
  isLoading: false,
  isFailed: false,
  hasError: false,
  email: "",
  password: "",
};

export const MyPageStateFactory = makeTypedFactory<IMyPageState, IMyPageStateRecord>(initialMyPageState);

export const MY_PAGE_INITIAL_STATE = MyPageStateFactory();
