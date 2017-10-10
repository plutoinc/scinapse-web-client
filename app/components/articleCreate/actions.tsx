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
  switch (currentStep) {
    case ARTICLE_CREATE_STEP.FIRST: {
      // Article Link Validation
      const isUrlInvalid = !validateUrl(articleCreateState.articleLink);

      if (isUrlInvalid) {
        return {
          type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
          payload: {
            step: currentStep,
          },
        };
      } else {
        return {
          type: ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP,
          payload: {
            step: currentStep,
          },
        };
      }
    }

    case ARTICLE_CREATE_STEP.SECOND: {
      // Article Category Validation
      const isArticleCategoryEmpty = articleCreateState.articleCategory === null;

      // Article Title Validation
      const isArticleTitleTooShort = articleCreateState.articleTitle.length < 1;

      // Article Author Input Validation
      let hasAuthorInputError: boolean = false;

      articleCreateState.authors.forEach((author: IAuthorRecord) => {
        const isAuthorNameTooShort = author.name.length < 1;
        const isAuthorInstitutionTooShort = author.organization.length < 1;

        if (isAuthorNameTooShort || isAuthorInstitutionTooShort) {
          hasAuthorInputError = true;
          return;
        }
      });

      // Article Abstract Validation
      const isAbstractTooShort = articleCreateState.abstract.length < 1;

      if (isArticleCategoryEmpty || isArticleTitleTooShort || hasAuthorInputError || isAbstractTooShort) {
        return {
          type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_VALIDATE_STEP,
          payload: {
            step: currentStep,
          },
        };
      } else {
        return {
          type: ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_VALIDATE_STEP,
          payload: {
            step: currentStep,
          },
        };
      }
    }

    default:
      break;
  }
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
      type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
      payload: {
        index,
        type: AUTHOR_NAME_TYPE,
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
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
      type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
      payload: {
        index,
        type: AUTHOR_INSTITUTION_TYPE,
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
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
