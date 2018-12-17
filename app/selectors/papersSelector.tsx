import { AppState } from "../reducers";

export function getPaperEntities(state: AppState) {
  return state.entities.papers;
}
