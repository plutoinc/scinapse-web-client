import { AppState } from "../reducers";

export function getPaperEntities(state: AppState) {
  return { papers: state.entities.papers };
}
