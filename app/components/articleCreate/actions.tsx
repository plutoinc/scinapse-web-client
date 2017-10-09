import { Dispatch } from "redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_CREATE_STEP, ARTICLE_CATEGORY, IArticleCreateState } from "./records";
import { validateUrl } from "../../helpers/validateUrl";
import { IAuthorRecord } from "../../model/author";
import { AUTHOR_NAME_TYPE, AUTHOR_INSTITUTION_TYPE } from "./records";

export function changeCreateStep(step: ARTICLE_CREATE_STEP) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_CREATE_STEP,
    payload: {
      step,
    },
  };
}

export function checkValidateStep(currentStep: ARTICLE_CREATE_STEP, articleCreateState: IArticleCreateState) {
  return async (dispatch: Dispatch<any>) => {
    switch (currentStep) {
      case ARTICLE_CREATE_STEP.FIRST: {
        // Article Link Validation
        const isUrlInvalid = validateUrl(articleCreateState.articleLink);
        if (!isUrlInvalid) {
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
              step: currentStep,
            },
          });
          return;
        }
        dispatch({
          type: ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP,
          payload: {
            step: currentStep,
          },
        });
        break;
      }

      case ARTICLE_CREATE_STEP.SECOND: {
        // Article Category Validation
        const isArticleCategoryEmpty = articleCreateState.articleCategory === null;
        if (isArticleCategoryEmpty) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "articleCategory",
              content: null,
            },
          });
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
            payload: {
              step: currentStep,
            },
          });
          return;
        }

        // Article Title Validation
        const isArticleTitleTooShort = articleCreateState.articleTitle.length < 1;
        if (isArticleTitleTooShort) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "articleTitle",
              content: null,
            },
          });
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
            payload: {
              step: currentStep,
            },
          });
          return;
        }

        // Article Author Input Validation
        let hasAuthorInputError: boolean = false;
        articleCreateState.authors.forEach((author: IAuthorRecord, index: number) => {
          const isAuthorNameTooShort = author.name.length < 1;
          const isAuthorInstitutionTooShort = author.organization.length < 1;

          if (isAuthorNameTooShort) {
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
              payload: {
                index,
                type: AUTHOR_NAME_TYPE,
              },
            });

            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
              payload: {
                step: currentStep,
              },
            });

            hasAuthorInputError = true;
            return;
          } else if (isAuthorInstitutionTooShort) {
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
              payload: {
                index,
                type: AUTHOR_INSTITUTION_TYPE,
              },
            });

            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
              payload: {
                step: currentStep,
              },
            });

            hasAuthorInputError = true;
            return;
          }
        });

        if (hasAuthorInputError) return;

        // Article Abstract Validation
        if (articleCreateState.abstract.length < 1) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "abstract",
              content: null,
            },
          });
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
            payload: {
              step: currentStep,
            },
          });
          return;
        }

        dispatch({
          type: ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP,
          payload: {
            step: currentStep,
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
