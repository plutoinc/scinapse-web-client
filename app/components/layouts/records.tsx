import { CompletionKeyword } from "../../api/completion";

export enum UserDevice {
  DESKTOP,
  TABLET,
  MOBILE,
}

export interface LayoutState
  extends Readonly<{
      userDevice: UserDevice;
      isKeywordCompletionOpen: boolean;
      isLoadingKeywordCompletion: boolean;
      completionKeywordList: CompletionKeyword[];
    }> {}

export const LAYOUT_INITIAL_STATE: LayoutState = {
  userDevice: UserDevice.DESKTOP,
  isKeywordCompletionOpen: false,
  isLoadingKeywordCompletion: false,
  completionKeywordList: [],
};
