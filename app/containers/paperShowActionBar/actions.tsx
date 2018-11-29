import { ActionCreators } from "../../actions/actionTypes";

export function openCollectionDropdown() {
  return ActionCreators.openCollectionDropdownInPaperShowActionBar();
}

export function closeCollectionDropdown() {
  return ActionCreators.closeCollectionDropdownInPaperShowActionBar();
}
