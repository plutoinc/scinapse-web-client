import { List } from "immutable";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { initialCurrentUser, ICurrentUserRecord, recordifyCurrentUser } from "../../model/currentUser";
import { IArticlesRecord } from "../../model/article";

export interface IProfileState {
  isLoading: boolean;
  hasError: boolean;
  fetchingContentLoading: boolean;
  fetchingContentError: boolean;
  profileImageInput: string;
  institutionInput: string;
  majorInput: string;
  userProfile: ICurrentUserRecord | null;
  articlesToShow: IArticlesRecord;
  reviewIdsToShow: List<number>;
  isEnd: boolean;
  page: number;
  reviewListIsEnd: boolean;
  reviewListPage: number;
}

export interface IProfileStateRecord extends TypedRecord<IProfileStateRecord>, IProfileState {}

const initialProfileState: IProfileState = {
  isLoading: false,
  hasError: false,
  fetchingContentLoading: false,
  fetchingContentError: false,
  profileImageInput: "",
  institutionInput: "",
  majorInput: "",
  userProfile: recordifyCurrentUser(initialCurrentUser),
  articlesToShow: List(),
  reviewIdsToShow: List(),
  isEnd: false,
  page: 0,
  reviewListIsEnd: false,
  reviewListPage: 0,
};

export const ProfileStateFactory = makeTypedFactory<IProfileState, IProfileStateRecord>(initialProfileState);

export const PROFILE_INITIAL_STATE = ProfileStateFactory();
