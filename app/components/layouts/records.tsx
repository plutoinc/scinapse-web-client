import { TypedRecord, makeTypedFactory } from "typed-immutable-record";

export interface ILayoutState {
  isTop: boolean;
}

export interface ILayoutStateRecord extends TypedRecord<ILayoutStateRecord>, ILayoutState {}

const initialLayoutState = {
  isTop: true,
};

export const LayoutStateFactory = makeTypedFactory<ILayoutState, ILayoutStateRecord>(initialLayoutState);

export const LAYOUT_INITIAL_STATE = LayoutStateFactory();
