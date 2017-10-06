import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_CREATE_STEP, ARTICLE_CATEGORY } from "./records";

export function changeCreateStep(step: ARTICLE_CREATE_STEP) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP,
    payload: {
      step,
    },
  };
}

export function toggleArticleCategoryDropDown() {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_TOGGLE_ARTICLE_CATEGORY_DROPDOWN,
  };
}

export function selectArticleCategory(category: ARTICLE_CATEGORY) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_SELECT_ARTICLE_CATEGORY,
    payload: {
      category,
    },
  };
}

export function plusAuthor() {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_PLUS_AUTHOR,
  };
}

export function minusAuthor() {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_MINUS_AUTHOR,
  };
}

export function changeArticleLink(articleLink: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_LINK,
    payload: {
      articleLink,
    },
  };
}

export function changeArticleTitle(articleTitle: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_TITLE,
    payload: {
      articleTitle,
    },
  };
}

export function changeAuthorName(index: number, name: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_AUTHOR_NAME,
    payload: {
      index,
      name,
    },
  };
}

export function changeAuthorInstitution(index: number, institution: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_AUTHOR_INSTITUTION,
    payload: {
      index,
      institution,
    },
  };
}

export function changeAbstract(abstract: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ABSTRACT,
    payload: {
      abstract,
    },
  };
}

export function changeNote(note: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_NOTE,
    payload: {
      note,
    },
  };
}
