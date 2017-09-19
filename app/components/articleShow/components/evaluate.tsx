import * as React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import { Step, Stepper, StepButton } from "material-ui/Stepper";
import { IArticleShowStateRecord, ARTICLE_EVALUATION_STEP } from "../records";
import GeneralButton from "../../common/buttons/general";
const styles = require("./evaluate.scss");

const MIN_SCORE = 1;
const MAX_SCORE = 10;

interface IArticleEvaluateProps {
  articleShow: IArticleShowStateRecord;
  handleEvaluationTabChange: () => void;
  handleClickStepButton: (step: ARTICLE_EVALUATION_STEP) => void;
  handleClickScore: (step: ARTICLE_EVALUATION_STEP, score: number) => void;
  handleSubmitEvaluation: () => void;
  goToNextStep: () => void;
  handleEvaluationChange: (step: ARTICLE_EVALUATION_STEP, comment: string) => void;
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
  const currentStep = props.articleShow.currentStep;

  return (
    <div>
      <div className={styles.stepWrapper}>
        <Stepper linear={false}>
          <Step
            completed={currentStep >= ARTICLE_EVALUATION_STEP.FIRST}
            active={currentStep === ARTICLE_EVALUATION_STEP.FIRST}
          >
            <StepButton
              onClick={() => {
                props.handleClickStepButton(ARTICLE_EVALUATION_STEP.FIRST);
              }}
            >
              Originality
            </StepButton>
          </Step>
          <Step
            completed={currentStep >= ARTICLE_EVALUATION_STEP.SECOND}
            active={currentStep === ARTICLE_EVALUATION_STEP.SECOND}
          >
            <StepButton
              onClick={() => {
                props.handleClickStepButton(ARTICLE_EVALUATION_STEP.SECOND);
              }}
            >
              Contribution
            </StepButton>
          </Step>
          <Step
            completed={currentStep >= ARTICLE_EVALUATION_STEP.THIRD}
            active={currentStep === ARTICLE_EVALUATION_STEP.THIRD}
          >
            <StepButton
              onClick={() => {
                props.handleClickStepButton(ARTICLE_EVALUATION_STEP.THIRD);
              }}
            >
              Analysis
            </StepButton>
          </Step>
          <Step
            completed={currentStep >= ARTICLE_EVALUATION_STEP.FOURTH}
            active={currentStep === ARTICLE_EVALUATION_STEP.FOURTH}
          >
            <StepButton
              onClick={() => {
                props.handleClickStepButton(ARTICLE_EVALUATION_STEP.FOURTH);
              }}
            >
              Expressiveness
            </StepButton>
          </Step>
        </Stepper>
      </div>
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

const ArticleEvaluate = (props: IArticleEvaluateProps) => {
  return (
    <div className={styles.evaluateWrapper}>
      <div className={styles.title}>Evaluate</div>
      <Tabs onChange={props.handleEvaluationTabChange} initialSelectedIndex={1} className={styles.tabWrapper}>
        <Tab label="Peer evaluation" />
        <Tab label="My evaluation" />
      </Tabs>
      <div className={styles.contentWrapper}>{getMyEvaluationComponent(props)}</div>
    </div>
  );
};

export default ArticleEvaluate;
