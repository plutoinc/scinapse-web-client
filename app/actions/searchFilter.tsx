import { ACTION_TYPES, SetActiveFilterBoxButtonAction } from './actionTypes';
import { FILTER_BUTTON_TYPE } from '../components/filterButton';

export function setActiveFilterButton(button: FILTER_BUTTON_TYPE | null): SetActiveFilterBoxButtonAction {
  return {
    type: ACTION_TYPES.ARTICLE_SEARCH_SET_ACTIVE_FILTER_BOX_BUTTON,
    payload: { button },
  };
}
