import { List } from "immutable";
import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { ICurrentUser, initialCurrentUser } from "../../model/currentUser";
import { IArticlesRecord } from "../../model/article";

export interface IProfileState {
  isLoading: boolean;
  hasError: boolean;
  fetchingArticleLoading: boolean;
  fetchingArticleError: boolean;
  profileImageInput: string;
  institutionInput: string;
  majorInput: string;
  userProfile: ICurrentUser | null;
  articlesToShow: IArticlesRecord;
  isEnd: boolean;
  page: number;
}

export interface IProfileStateRecord extends TypedRecord<IProfileStateRecord>, IProfileState {}

const initialProfileState: IProfileState = {
  isLoading: false,
  hasError: false,
  fetchingArticleLoading: false,
  fetchingArticleError: false,
  profileImageInput: "",
  institutionInput: "",
  majorInput: "",
  userProfile: initialCurrentUser,
  articlesToShow: List(),
  isEnd: false,
  page: 0,
};

export const ProfileStateFactory = makeTypedFactory<IProfileState, IProfileStateRecord>(initialProfileState);

export const PROFILE_INITIAL_STATE = ProfileStateFactory();
