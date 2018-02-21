import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface LayoutState {
  isTop: boolean;
  isMobile: boolean;
}

export interface LayoutStateRecord extends TypedRecord<LayoutStateRecord>, LayoutState {}

const initialLayoutState = {
  isTop: true,
  isMobile: false,
};

export const LayoutStateFactory = makeTypedFactory<LayoutState, LayoutStateRecord>(initialLayoutState);

export const LAYOUT_INITIAL_STATE = LayoutStateFactory();
