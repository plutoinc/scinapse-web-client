import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface IMyPageState {
  isLoading: boolean;
  hasError: boolean;
  profileImageInput: string;
  institutionInput: string;
  majorInput: string;
}

export interface IMyPageStateRecord extends TypedRecord<IMyPageStateRecord>, IMyPageState {}

const initialMyPageState: IMyPageState = {
  isLoading: false,
  hasError: false,
  profileImageInput: "",
  institutionInput: "",
  majorInput: "",
};

export const MyPageStateFactory = makeTypedFactory<IMyPageState, IMyPageStateRecord>(initialMyPageState);

export const MY_PAGE_INITIAL_STATE = MyPageStateFactory();
