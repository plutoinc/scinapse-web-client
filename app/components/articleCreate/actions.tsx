import { ACTION_TYPES } from "../../actions/actionTypes";
import { ARTICLE_CREATE_STEP, ARTICLE_CATEGORY, ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE } from "./records";
import { validateUrl } from "../../helpers/validateUrl";

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

export function checkValidArticleLinkInput(articleLink: string) {
  if (!validateUrl(articleLink)) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        type: "articleLink",
        content: "Please enter valid article link",
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
  if (articleTitle.length < 1) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        type: "articleTitle",
        content: "",
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

export function checkValidAuthorName(index: number, name: string) {
  const type: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "name";

  if (name.length < 1) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
      payload: {
        index,
        type,
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
  const type: ARTICLE_CREATE_AUTHOR_INPUT_ERROR_TYPE = "institution";

  if (institution.length < 1) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_AUTHOR_INPUT_ERROR,
      payload: {
        index,
        type,
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
  if (abstract.length < 1) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        type: "abstract",
        content: "",
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
