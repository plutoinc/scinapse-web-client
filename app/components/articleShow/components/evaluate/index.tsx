import * as React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import { ARTICLE_EVALUATION_STEP, ARTICLE_EVALUATION_TAB, IArticleShowStateRecord } from "../../records";
import GeneralButton from "../../../common/buttons/general";
import EvaluateStep, { IEvaluateStepProps } from "./evaluateStep";
import EvaluationFinalStep from "./finalStep";
import PeerEvaluation from "../peerEvaluation";
import { IArticleRecord } from "../../../../model/article";
import { IHandlePeerEvaluationCommentSubmitParams } from "../../actions";
import ArticleSpinner from "../../../common/spinner/articleSpinner";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import { IEvaluationsRecord } from "../../../../model/evaluation";
const styles = require("./evaluate.scss");

const MIN_SCORE = 1;
const MAX_SCORE = 10;

interface IArticleEvaluateProps extends IEvaluateStepProps {
  article: IArticleRecord;
  evaluations: IEvaluationsRecord;
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  handleEvaluationTabChange: () => void;
  handleClickScore: (step: ARTICLE_EVALUATION_STEP, score: number) => void;
  handleSubmitEvaluation: (e: React.FormEvent<HTMLFormElement>) => void;
  goToNextStep: () => void;
  handleEvaluationChange: (step: ARTICLE_EVALUATION_STEP, comment: string) => void;
  handleTogglePeerEvaluation: (peerEvaluationId: number) => void;
  handlePeerEvaluationCommentSubmit: (params: IHandlePeerEvaluationCommentSubmitParams) => void;
  handleVotePeerEvaluation: (articleId: number, evaluationId: number) => void;
}

function getCommentForm(props: IArticleEvaluateProps) {
  const { articleShow } = props;

  const inputValue = () => {
    switch (articleShow.currentStep) {
      case ARTICLE_EVALUATION_STEP.FIRST: {
        return articleShow.myOriginalityComment;
      }

      case ARTICLE_EVALUATION_STEP.SECOND: {
        return articleShow.mySignificanceComment;
      }
      case ARTICLE_EVALUATION_STEP.THIRD: {
        return articleShow.myValidityComment;
      }
      case ARTICLE_EVALUATION_STEP.FOURTH: {
        return articleShow.myOrganizationComment;
      }

      default:
        return "";
    }
  };

  const { myOriginalityScore, mySignificanceScore, myValidityScore, myOrganizationScore } = props.articleShow;
  const canSubmit = !!myOriginalityScore && !!mySignificanceScore && !!myValidityScore && !!myOrganizationScore;

  if (props.articleShow.currentStep === ARTICLE_EVALUATION_STEP.FOURTH) {
    return (
      <div className={styles.inputWrapper}>
        <textarea
          onChange={e => {
            e.preventDefault();
            props.handleEvaluationChange(props.articleShow.currentStep, e.currentTarget.value);
          }}
          value={inputValue()}
          placeholder={getPlaceholder(props.articleShow.currentStep)}
          className={styles.commentWrapper}
        />
        <GeneralButton
          style={{
            width: "129.5px",
            height: "41.6px",
          }}
          type="submit"
          disabled={!canSubmit}
        >
          Submit >
        </GeneralButton>
      </div>
    );
  } else {
    return (
      <div className={styles.inputWrapper}>
        <textarea
          onChange={e => {
            e.preventDefault();
            props.handleEvaluationChange(props.articleShow.currentStep, e.currentTarget.value);
          }}
          value={inputValue()}
          placeholder={getPlaceholder(props.articleShow.currentStep)}
          className={styles.commentWrapper}
        />
        <GeneralButton
          style={{
            width: "129.5px",
            height: "41.6px",
          }}
          type="button"
          onClick={props.goToNextStep}
          disabled={getDisabledState(props)}
        >
          Next >
        </GeneralButton>
      </div>
    );
  }
}

function getPlaceholder(step: ARTICLE_EVALUATION_STEP) {
  switch (step) {
    case ARTICLE_EVALUATION_STEP.FIRST: {
      return "Enter your comment about this article’s originality(optional)";
    }

    case ARTICLE_EVALUATION_STEP.SECOND: {
      return "Enter your comment about this article’s significance(optional)";
    }

    case ARTICLE_EVALUATION_STEP.THIRD: {
      return "Enter your comment about this article’s validity(optional)";
    }

    case ARTICLE_EVALUATION_STEP.FOURTH: {
      return "Enter your comment about this article’s organization(optional)";
    }

    default:
      break;
  }
}

function getDisabledState(props: IArticleEvaluateProps) {
  const { currentStep } = props.articleShow;

  switch (currentStep) {
    case ARTICLE_EVALUATION_STEP.FIRST: {
      if (!props.articleShow.myOriginalityScore) {
        return true;
      } else {
        return false;
      }
    }

    case ARTICLE_EVALUATION_STEP.SECOND: {
      if (!props.articleShow.mySignificanceScore) {
        return true;
      } else {
        return false;
      }
    }

    case ARTICLE_EVALUATION_STEP.THIRD: {
      if (!props.articleShow.myValidityScore) {
        return true;
      } else {
        return false;
      }
    }

    case ARTICLE_EVALUATION_STEP.FOURTH: {
      if (!props.articleShow.myOrganizationScore) {
        return true;
      } else {
        return false;
      }
    }

    default:
      break;
  }
}

function getScoreGraph(props: IArticleEvaluateProps) {
  const scoreNode = [];
  const { currentStep } = props.articleShow;

  function getClassName(score: number) {
    switch (currentStep) {
      case ARTICLE_EVALUATION_STEP.FIRST: {
        if (props.articleShow.myOriginalityScore && props.articleShow.myOriginalityScore === score) {
          return `${styles.scoreItem} ${styles.activeScore}`;
        } else {
          return styles.scoreItem;
        }
      }

      case ARTICLE_EVALUATION_STEP.SECOND: {
        if (props.articleShow.mySignificanceScore && props.articleShow.mySignificanceScore === score) {
          return `${styles.scoreItem} ${styles.activeScore}`;
        } else {
          return styles.scoreItem;
        }
      }

      case ARTICLE_EVALUATION_STEP.THIRD: {
        if (props.articleShow.myValidityScore && props.articleShow.myValidityScore === score) {
          return `${styles.scoreItem} ${styles.activeScore}`;
        } else {
          return styles.scoreItem;
        }
      }

      case ARTICLE_EVALUATION_STEP.FOURTH: {
        if (props.articleShow.myOrganizationScore && props.articleShow.myOrganizationScore === score) {
          return `${styles.scoreItem} ${styles.activeScore}`;
        } else {
          return styles.scoreItem;
        }
      }

      default:
        break;
    }
  }

  for (let i = MIN_SCORE; i < MAX_SCORE + 1; i++) {
    scoreNode.push(
      <span
        onClick={() => {
          props.handleClickScore(currentStep, i);
        }}
        className={getClassName(i)}
        key={`scoreNode_${i}`}
      >
        {i}
      </span>,
    );
  }

  return <div className={styles.scoreGraphWrapper}>{scoreNode}</div>;
}
function getStepDescription(currentStep: ARTICLE_EVALUATION_STEP) {
  switch (currentStep) {
    case ARTICLE_EVALUATION_STEP.FIRST: {
      return `Are the ideas, methods, and objects of research unique and distinct from existing research? Does the research contain only original contents and completely avoid plagiarism?`;
    }

    case ARTICLE_EVALUATION_STEP.SECOND: {
      return `Does the research contribute to academic progress and development? Does it provide insight to understand and build theoretical systems for new phenomena? Does it have potential for further research?`;
    }

    case ARTICLE_EVALUATION_STEP.THIRD: {
      return `Is the research reliable and valid? Is the research accurate and error-free in the process? Is there a clear description of research methods, conditions and tools to prove reproducibility?`;
    }

    case ARTICLE_EVALUATION_STEP.FOURTH: {
      return `Is the research written clearly and without ambiguity? Is it logically written and easily understandable? Is it concise and contains only research-related content?`;
    }

    default:
      break;
  }
}
function getMyEvaluationComponent(props: IArticleEvaluateProps) {
  if (
    props.currentUser &&
    props.evaluations &&
    (props.article.evaluated || props.articleShow.currentStep === ARTICLE_EVALUATION_STEP.FINAL)
  ) {
    const myEvaluation = props.evaluations.find(evaluation => {
      return evaluation.createdBy.id === props.currentUser.id;
    });

    if (!myEvaluation) {
      return null;
    }

    return (
      <EvaluationFinalStep evaluation={myEvaluation} articleShow={props.articleShow} currentUser={props.currentUser} />
    );
  } else {
    return (
      <div className={styles.contentWrapper}>
        <EvaluateStep articleShow={props.articleShow} handleClickStepButton={props.handleClickStepButton} />
        <div className={styles.stepDescriptionWrapper}>{getStepDescription(props.articleShow.currentStep)}</div>
        {getScoreGraph(props)}
        <form onSubmit={props.handleSubmitEvaluation} className={styles.commentInputWrapper}>
          {getCommentForm(props)}
        </form>
      </div>
    );
  }
}

function mapEvaluations(props: IArticleEvaluateProps) {
  if (!props.evaluations || props.evaluations.isEmpty()) {
    return <div>Nothing...</div>;
  }
  return props.evaluations.map(evaluation => {
    return (
      <PeerEvaluation
        articleId={props.article.id}
        id={evaluation.id}
        key={evaluation.id}
        evaluation={evaluation}
        handleTogglePeerEvaluation={props.handleTogglePeerEvaluation}
        currentUser={props.currentUser}
        articleShow={props.articleShow}
        handlePeerEvaluationCommentSubmit={props.handlePeerEvaluationCommentSubmit}
        handleVotePeerEvaluation={props.handleVotePeerEvaluation}
      />
    );
  });
}

function getEvaluationComponent(props: IArticleEvaluateProps) {
  if (props.articleShow.isEvaluationSubmitLoading) {
    return (
      <div className={styles.spinnerWrapper}>
        <ArticleSpinner />
      </div>
    );
  }

  if (props.articleShow.evaluationTab === ARTICLE_EVALUATION_TAB.MY) {
    return getMyEvaluationComponent(props);
  } else {
    return mapEvaluations(props);
  }
}

const tabContainerStyle = {
  width: 360,
  backgroundColor: "transparent",
};

const tabStyle = {
  width: 180,
  fontSize: "16.5px",
  lineHeight: 1.52,
  color: "#0c1020",
  textTransform: "none",
};

const ArticleEvaluate = (props: IArticleEvaluateProps) => {
  return (
    <div className={styles.evaluateWrapper}>
      <div className={styles.title}>Evaluate</div>
      <Tabs
        tabItemContainerStyle={tabContainerStyle}
        onChange={props.handleEvaluationTabChange}
        initialSelectedIndex={1}
        className={styles.tabWrapper}
        inkBarStyle={{
          height: "3px",
          backgroundColor: "#6096ff",
        }}
      >
        <Tab style={tabStyle} label="Peer evaluation" />
        <Tab style={tabStyle} label="My evaluation" />
      </Tabs>
      {getEvaluationComponent(props)}
    </div>
  );
};

export default ArticleEvaluate;
