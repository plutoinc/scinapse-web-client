import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface LayoutState {
  isTop: boolean;
  isMobile: boolean;
  isUserDropdownOpen: boolean;
  userDropdownAnchorElement: React.ReactInstance | null;
  isBookmarkLoading: boolean;
  hasErrorOnFetchingBookmark: boolean;
  bookmarkCount: number;
}

export interface LayoutStateRecord extends TypedRecord<LayoutStateRecord>, LayoutState {}

export const initialLayoutState: LayoutState = {
  isTop: true,
  isMobile: false,
  isUserDropdownOpen: false,
  userDropdownAnchorElement: null,
  isBookmarkLoading: false,
  hasErrorOnFetchingBookmark: false,
  bookmarkCount: 0,
};

export const LayoutStateFactory = makeTypedFactory<LayoutState, LayoutStateRecord>(initialLayoutState);

export const LAYOUT_INITIAL_STATE = LayoutStateFactory();
