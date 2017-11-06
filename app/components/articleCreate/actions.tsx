import axios from "axios";
import { push } from "react-router-redux";
import { Dispatch } from "redux";
import { debounce } from "lodash";
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
import ArticleAPI from "../../api/article";
import { ICreateArticleParams } from "../../api/article";
import alertToast from "../../helpers/makePlutoToastAction";
import { IArticleRecord } from "../../model/article";

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

        // Article Summary Validation
        const isSummaryTooShort = articleCreateState.summary.length < 1;
        if (isSummaryTooShort) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
            payload: {
              type: "summary",
            },
          });
          hasSecondStepError = true;
        } else {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
            payload: {
              type: "summary",
            },
          });
        }

        if (!hasSecondStepError) {
          dispatch(changeCreateStep(ARTICLE_CREATE_STEP.FINAL));
        }
        break;
      }

      case ARTICLE_CREATE_STEP.FINAL: {
        const { articleLink, articleCategory, articleTitle, authors, summary, note } = articleCreateState;

        try {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_START_TO_CREATE_ARTICLE,
          });
          dispatch(changeCreateStep(ARTICLE_CREATE_STEP.FINAL + 1));

          const createArticleParams: ICreateArticleParams = {
            authors: authors.toJS(),
            link: articleLink,
            note,
            summary,
            title: articleTitle,
            type: articleCategory,
          };

          const createdArticleRecord: IArticleRecord = await ArticleAPI.createArticle(createArticleParams);

          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_SUCCEEDED_TO_CREATE_ARTICLE,
            payload: {
              article: createdArticleRecord,
            },
          });

          alertToast({
            type: "success",
            message: "Succeeded to create Article!!",
          });
          dispatch(push(`/articles/${createdArticleRecord.id}`));
        } catch (err) {
          dispatch({
            type: ACTION_TYPES.ARTICLE_CREATE_FAILED_TO_CREATE_ARTICLE,
          });
          dispatch(changeCreateStep(ARTICLE_CREATE_STEP.FINAL));
          alert(`Failed to create Article! ${err}`);
        }
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

export function minusAuthor(index: number) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_MINUS_AUTHOR,
    payload: {
      index,
    },
  };
}

async function getArXivArticleInformation(articleLink: string, dispatch: Dispatch<any>) {
  const articleLinkPathArray = articleLink.split("/");
  const ids = articleLinkPathArray.filter(path => {
    return !isNaN(parseInt(path));
  });

  if (ids && ids.length > 0) {
    try {
      const result = await axios.get(
        `https://6pjyad91c5.execute-api.us-east-1.amazonaws.com/prod/arxiv?articleIds=${ids[0]}`,
      );
      const { article } = result.data;
      const author = article.author;
      const summary = article.summary;

      dispatch(changeArticleTitle(article.title[0]));

      author.forEach((person: any, index: number) => {
        if (index > 0) {
          dispatch(plusAuthor());
        }
        dispatch(changeAuthorName(index, person.name[0]));
      });

      dispatch(changeSummary(summary[0]));
    } catch (_err) {}
  }
}

const debouncedGetArXivArticleInformation = debounce(getArXivArticleInformation, 300);

export function changeArticleLink(articleLink: string) {
  return (dispatch: Dispatch<any>) => {
    if (articleLink.includes("arxiv")) {
      debouncedGetArXivArticleInformation(articleLink, dispatch);
    }

    dispatch({
      type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_ARTICLE_LINK,
      payload: {
        articleLink,
      },
    });
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
  const isAuthorInstitutionTooShort = !institution || institution.length < 1;

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

export function changeSummary(summary: string) {
  return {
    type: ACTION_TYPES.ARTICLE_CREATE_CHANGE_SUMMARY,
    payload: {
      summary,
    },
  };
}

export function checkValidSummary(summary: string) {
  // Article Summary Validation
  const isSummaryTooShort = summary.length < 1;
  if (isSummaryTooShort) {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_FORM_ERROR,
      payload: {
        type: "summary",
      },
    };
  } else {
    return {
      type: ACTION_TYPES.ARTICLE_CREATE_REMOVE_FORM_ERROR,
      payload: {
        type: "summary",
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
