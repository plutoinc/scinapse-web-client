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
const styles = require("./evaluate.scss");

const MIN_SCORE = 1;
const MAX_SCORE = 10;

interface IArticleEvaluateProps extends IEvaluateStepProps {
  article: IArticleRecord;
  currentUser: ICurrentUserRecord;
  articleShow: IArticleShowStateRecord;
  handleEvaluationTabChange: () => void;
  handleClickScore: (step: ARTICLE_EVALUATION_STEP, score: number) => void;
  handleSubmitEvaluation: (e: React.FormEvent<HTMLFormElement>) => void;
  goToNextStep: () => void;
  handleEvaluationChange: (step: ARTICLE_EVALUATION_STEP, comment: string) => void;
  handleTogglePeerEvaluation: (peerEvaluationId: number) => void;
  handlePeerEvaluationCommentSubmit: (params: IHandlePeerEvaluationCommentSubmitParams) => void;
}

function getCommentForm(props: IArticleEvaluateProps) {
  const { articleShow } = props;

  const inputValue = () => {
    switch (articleShow.currentStep) {
      case ARTICLE_EVALUATION_STEP.FIRST: {
        return articleShow.myOriginalityComment;
      }

      case ARTICLE_EVALUATION_STEP.SECOND: {
        return articleShow.myContributionComment;
      }
      case ARTICLE_EVALUATION_STEP.THIRD: {
        return articleShow.myAnalysisComment;
      }
      case ARTICLE_EVALUATION_STEP.FOURTH: {
        return articleShow.myExpressivenessComment;
      }

      default:
        return "";
    }
  };

  const { myOriginalityScore, myContributionScore, myAnalysisScore, myExpressivenessScore } = props.articleShow;
  const canSubmit = !!myOriginalityScore && !!myContributionScore && !!myAnalysisScore && !!myExpressivenessScore;

  if (props.articleShow.currentStep === ARTICLE_EVALUATION_STEP.FOURTH) {
    return (
      <div className={styles.inputWrapper}>
        <input
          onChange={e => {
            props.handleEvaluationChange(props.articleShow.currentStep, e.currentTarget.value);
          }}
          value={inputValue()}
          placeholder="Enter your comment(Option)"
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
        <input
          onChange={e => {
            props.handleEvaluationChange(props.articleShow.currentStep, e.currentTarget.value);
          }}
          value={inputValue()}
          placeholder="Enter your comment(Option)"
          className={styles.commentWrapper}
        />
        <GeneralButton
          style={{
            width: "129.5px",
            height: "41.6px",
          }}
          type="button"
          onClick={props.goToNextStep}
        >
          Next >
        </GeneralButton>
      </div>
    );
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
        if (props.articleShow.myContributionScore && props.articleShow.myContributionScore === score) {
          return `${styles.scoreItem} ${styles.activeScore}`;
        } else {
          return styles.scoreItem;
        }
      }

      case ARTICLE_EVALUATION_STEP.THIRD: {
        if (props.articleShow.myAnalysisScore && props.articleShow.myAnalysisScore === score) {
          return `${styles.scoreItem} ${styles.activeScore}`;
        } else {
          return styles.scoreItem;
        }
      }

      case ARTICLE_EVALUATION_STEP.FOURTH: {
        if (props.articleShow.myExpressivenessScore && props.articleShow.myExpressivenessScore === score) {
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

function getMyEvaluationComponent(props: IArticleEvaluateProps) {
  if (
    props.currentUser &&
    (props.article.evaluated || props.articleShow.currentStep === ARTICLE_EVALUATION_STEP.FINAL)
  ) {
    const myEvaluation = props.article.evaluations.find(evaluation => {
      return evaluation.createdBy.id === props.currentUser.id;
    });

    return (
      <EvaluationFinalStep evaluation={myEvaluation} articleShow={props.articleShow} currentUser={props.currentUser} />
    );
  } else {
    return (
      <div className={styles.contentWrapper}>
        <EvaluateStep articleShow={props.articleShow} handleClickStepButton={props.handleClickStepButton} />
        <div className={styles.stepDescriptionWrapper}>
          Is the research proposition, method of study, object of observation, or form of overall statement unique and
          distinct from previous research?
        </div>
        {getScoreGraph(props)}
        <form onSubmit={props.handleSubmitEvaluation} className={styles.commentInputWrapper}>
          {getCommentForm(props)}
        </form>
      </div>
    );
  }
}

function mapEvaluations(props: IArticleEvaluateProps) {
  return props.article.evaluations.map(evaluation => {
    return (
      <PeerEvaluation
        id={evaluation.id}
        key={evaluation.id}
        evaluation={evaluation}
        handleTogglePeerEvaluation={props.handleTogglePeerEvaluation}
        currentUser={props.currentUser}
        articleShow={props.articleShow}
        handlePeerEvaluationCommentSubmit={props.handlePeerEvaluationCommentSubmit}
      />
    );
  });
}

function getEvaluationComponent(props: IArticleEvaluateProps) {
  if (props.articleShow.isEvaluationLoading) {
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
