import { Dispatch } from "redux";
import { ACTION_TYPES } from "../../actions/actionTypes";
import {
  ARTICLE_CREATE_STEP,
  ARTICLE_CATEGORY,
  IArticleCreateState,
  AUTHOR_NAME_TYPE,
  AUTHOR_INSTITUTION_TYPE,
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

export function checkValidateStep(currentStep: ARTICLE_CREATE_STEP, articleCreateState: IArticleCreateState) {
  return (dispatch: Dispatch<any>) => {
    switch (currentStep) {
      case ARTICLE_CREATE_STEP.FIRST: {
        // Article Link Validation
        const isUrlInvalid = !validateUrl(articleCreateState.articleLink);

        if (isUrlInvalid) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "articleLink",
            },
          });
        } else {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
            payload: {
              type: "articleLink",
            },
          });
          dispatch(changeCreateStep(ARTICLE_CREATE_STEP.SECOND));
        }
        break;
      }

      case ARTICLE_CREATE_STEP.SECOND: {
        let hasSecondStepError = false;
        // Article Category Validation
        const isArticleCategoryEmpty = articleCreateState.articleCategory === null;
        if (isArticleCategoryEmpty) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "articleCategory",
            },
          });
          hasSecondStepError = true;
        } else {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
            payload: {
              type: "articleCategory",
            },
          });
        }

        // Article Title Validation
        const isArticleTitleTooShort = articleCreateState.articleTitle.length < 1;
        if (isArticleTitleTooShort) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "articleTitle",
            },
          });
          hasSecondStepError = true;
        } else {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
            payload: {
              type: "articleTitle",
            },
          });
        }

        // Article Author Input Validation
        articleCreateState.authors.forEach((author: IAuthorRecord, index: number) => {
          const isAuthorNameTooShort = author.name.length < 1;
          if (isAuthorNameTooShort) {
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
              payload: {
                type: AUTHOR_NAME_TYPE,
                index,
              },
            });
            hasSecondStepError = true;
          } else {
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
              payload: {
                type: AUTHOR_NAME_TYPE,
                index,
              },
            });
          }

          const isAuthorInstitutionTooShort = author.institution.length < 1;
          if (isAuthorInstitutionTooShort) {
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
              payload: {
                index,
                type: AUTHOR_INSTITUTION_TYPE,
              },
            });
            hasSecondStepError = true;
          } else {
            dispatch({
              type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
              payload: {
                index,
                type: AUTHOR_INSTITUTION_TYPE,
              },
            });
          }
        });

        // Article Abstract Validation
        const isAbstractTooShort = articleCreateState.abstract.length < 1;
        if (isAbstractTooShort) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "abstract",
            },
          });
          hasSecondStepError = true;
        } else {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
            payload: {
              type: "abstract",
            },
          });
        }

        if (!hasSecondStepError) {
          dispatch(changeCreateStep(ARTICLE_CREATE_STEP.FINAL));
        }
        break;
      }

      case ARTICLE_CREATE_STEP.FINAL: {
        // TODO: API connect to Article Create
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

export function checkValidArticleCategory(category: ARTICLE_CATEGORY) {
  const isArticleCategoryEmpty = category === null;
  if (isArticleCategoryEmpty) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        type: "articleCategory",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
      payload: {
        type: "articleCategory",
      },
    };
  }
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

export function checkValidArticleLink(articleLink: string) {
  // Article Link Validation
  const isUrlInvalid = !validateUrl(articleLink);
  if (isUrlInvalid) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        type: "articleLink",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
      payload: {
        type: "articleLink",
      },
    };
  }
}

export function changeArticleTitle(articleTitle: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_TITLE,
    payload: {
      articleTitle,
    },
  };
}

export function checkValidArticleTitle(articleTitle: string) {
  // Article Title Validation
  const isArticleTitleTooShort = articleTitle.length < 1;
  if (isArticleTitleTooShort) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        type: "articleTitle",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
      payload: {
        type: "articleTitle",
      },
    };
  }
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

export function checkValidAuthorName(index: number, authorName: string) {
  // Author Name Validation
  const isAuthorNameTooShort = authorName.length < 1;

  if (isAuthorNameTooShort) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        index,
        type: AUTHOR_NAME_TYPE,
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
      payload: {
        index,
        type: "name",
      },
    };
  }
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

export function checkValidAuthorInstitution(index: number, institution: string) {
  // Author Institution Validation
  const isAuthorInstitutionTooShort = institution.length < 1;

  if (isAuthorInstitutionTooShort) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        index,
        type: AUTHOR_INSTITUTION_TYPE,
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
      payload: {
        index,
        type: "institution",
      },
    };
  }
}

export function changeAbstract(abstract: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ABSTRACT,
    payload: {
      abstract,
    },
  };
}

export function checkValidAbstract(abstract: string) {
  // Article Abstract Validation
  const isAbstractTooShort = abstract.length < 1;
  if (isAbstractTooShort) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        type: "abstract",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
      payload: {
        type: "abstract",
      },
    };
  }
}

export function changeNote(note: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_NOTE,
    payload: {
      note,
    },
  };
}
