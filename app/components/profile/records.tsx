import { TypedRecord, makeTypedFactory } from "typed-immutable-record";
import { ICurrentUser, initialCurrentUser } from "../../model/currentUser";

export interface IProfileState {
  isLoading: boolean;
  hasError: boolean;
  profileImageInput: string;
  institutionInput: string;
  majorInput: string;
  userProfile: ICurrentUser | null;
}

export interface IProfileStateRecord extends TypedRecord<IProfileStateRecord>, IProfileState {}

const initialProfileState: IProfileState = {
  isLoading: false,
  hasError: false,
  profileImageInput: "",
  institutionInput: "",
  majorInput: "",
  userProfile: initialCurrentUser,
};

export const ProfileStateFactory = makeTypedFactory<IProfileState, IProfileStateRecord>(initialProfileState);

export const PROFILE_INITIAL_STATE = ProfileStateFactory();
