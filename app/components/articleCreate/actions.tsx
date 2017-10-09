import { Dispatch } from "redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import {
  ARTICLE_CREATE_STEP,
  ARTICLE_CATEGORY,
  ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE,
  IArticleCreateState,
} from "./records";
import { validateUrl } from "../../helpers/validateUrl";
import { IAuthorRecord } from "../../model/author";

export function changeCreateStep(step: ARTICLE_CREATE_STEP) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP,
    payload: {
      step,
    },
  };
}

export function checkValidateStep(nowStep: ARTICLE_CREATE_STEP, articleCreateState: IArticleCreateState) {
  return async (dispatch: Dispatch<any>) => {
    switch (nowStep) {
      case ARTICLE_CREATE_STEP.FIRST: {
        // Article Link Validation
        if (!validateUrl(articleCreateState.articleLink)) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "articleLink",
              content: "Please enter valid article link",
            },
          });
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
            payload: {
              step: nowStep,
            },
          });
          return;
        }
        dispatch({
          type: ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP,
          payload: {
            step: nowStep,
          },
        });
        break;
      }

      case ARTICLE_CREATE_STEP.SECOND: {
        // Article Category Validation
        if (articleCreateState.articleCategory === null) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "articleCategory",
              content: "",
            },
          });
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
            payload: {
              step: nowStep,
            },
          });
          return;
        }

        // Article Title Validation
        if (articleCreateState.articleTitle.length < 1) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "articleTitle",
              content: "",
            },
          });
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
            payload: {
              step: nowStep,
            },
          });
          return;
        }

        // Article Author Input Validation
        const authorName: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "name";
        const authorInstitution: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "institution";
        let authorInputError: boolean = false;
        articleCreateState.authors.forEach((author: IAuthorRecord, index: number) => {
          if (author.name.length < 1) {
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
              payload: {
                index,
                type: authorName,
              },
            });
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
              payload: {
                step: nowStep,
              },
            });
            authorInputError = true;
            return;
          } else if (author.organization.length < 1) {
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
              payload: {
                index,
                type: authorInstitution,
              },
            });
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
              payload: {
                step: nowStep,
              },
            });
            authorInputError = true;
            return;
          }
        });

        if (authorInputError) return;

        // Article Abstract Validation
        if (articleCreateState.abstract.length < 1) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "abstract",
              content: "",
            },
          });
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
            payload: {
              step: nowStep,
            },
          });
          return;
        }

        dispatch({
          type: ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP,
          payload: {
            step: nowStep,
          },
        });
        break;
      }

      default:
        break;
    }
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
