import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ILayoutState {
  isTop: boolean;
  isMobile: boolean;
}

export interface ILayoutStateRecord extends TypedRecord<ILayoutStateRecord>, ILayoutState {}

const initialLayoutState = {
  isTop: true,
  isMobile: false,
};

export const LayoutStateFactory = makeTypedFactory<ILayoutState, ILayoutStateRecord>(initialLayoutState);

export const LAYOUT_INITIAL_STATE = LayoutStateFactory();
