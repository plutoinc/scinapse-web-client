import { ActionCreators } from "./actionTypes";
import { ProfileMetaEnum } from "../components/profileMeta";
import { Award, Experience, Education } from "../model/profile";

export interface AddProfileMetaItemParams {
  profileId: string;
  profileMetaType: ProfileMetaEnum;
  meta: Education | Experience | Award;
}

export function addProfileMetaItem(params: AddProfileMetaItemParams) {
  return ActionCreators.addProfileMetaItem(params);
}
