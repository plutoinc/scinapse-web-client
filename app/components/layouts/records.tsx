import { CompletionKeyword } from "../../api/completion";

export enum UserDevice {
  DESKTOP,
  TABLET,
  MOBILE,
}

export interface LayoutState
  extends Readonly<{
      userDevice: UserDevice;
      completionKeywordList: CompletionKeyword[];
    }> {}

export const LAYOUT_INITIAL_STATE: LayoutState = {
  userDevice: UserDevice.DESKTOP,
  completionKeywordList: [],
};
