import * as React from "react";
import { IArticleShowStateRecord, ARTICLE_EVALUATION_STEP } from "../../records";
import EvaluateStep from "../evaluate/evaluateStep";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { IArticleRecord } from "../../../../model/article";
import ReviewInput from "../evaluate/reviewInput";
import { ICurrentUserRecord } from "../../../../model/currentUser";

const styles = require("../evaluate/evaluate.scss");

export interface IMyEvaluationProps {
  articleShow: IArticleShowStateRecord;
  currentUser: ICurrentUserRecord;
  article: IArticleRecord;
  handleClickScore: (step: ARTICLE_EVALUATION_STEP, score: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  handleSubmitEvaluation: (e: React.FormEvent<HTMLFormElement>) => void;
  handleReviewChange: (review: string) => void;
}

interface IMyEvaluationState {
  isInitial: boolean;
}

const MIN_SCORE = 1;
const MAX_SCORE = 10;

class MyEvaluation extends React.PureComponent<IMyEvaluationProps, IMyEvaluationState> {
  public constructor(props: IMyEvaluationProps) {
    super(props);

    this.state = {
      isInitial: true,
    };
  }

  private getDisabledState = () => {
    const { articleShow } = this.props;
    const { currentStep } = articleShow;

    switch (currentStep) {
      case ARTICLE_EVALUATION_STEP.FIRST: {
        if (!articleShow.myOriginalityScore) {
          return true;
        } else {
          return false;
        }
      }

      case ARTICLE_EVALUATION_STEP.SECOND: {
        if (!articleShow.mySignificanceScore) {
          return true;
        } else {
          return false;
        }
      }

      case ARTICLE_EVALUATION_STEP.THIRD: {
        if (!articleShow.myValidityScore) {
          return true;
        } else {
          return false;
        }
      }

      case ARTICLE_EVALUATION_STEP.FOURTH: {
        if (!articleShow.myOrganizationScore) {
          return true;
        } else {
          return false;
        }
      }

      default:
        break;
    }
  };

  private getButtons = () => {
    const { articleShow, goToNextStep, goToPrevStep } = this.props;

    const { myOriginalityScore, mySignificanceScore, myValidityScore, myOrganizationScore } = articleShow;
    const canSubmit = !!myOriginalityScore && !!mySignificanceScore && !!myValidityScore && !!myOrganizationScore;

    if (articleShow.currentStep === ARTICLE_EVALUATION_STEP.FIFTH) {
      return (
        <div className={styles.buttonsWrapper}>
          <button onClick={goToPrevStep} className={styles.prevButton} type="button">
            {`<`}
          </button>
          <button className={styles.nextButton} disabled={!canSubmit} type="submit">
            Submit >
          </button>
        </div>
      );
    } else if (articleShow.currentStep === ARTICLE_EVALUATION_STEP.FIRST) {
      return (
        <div className={styles.buttonWrapper}>
          <button onClick={goToNextStep} className={styles.nextButton} disabled={this.getDisabledState()} type="button">
            Next >
          </button>
        </div>
      );
    } else {
      return (
        <div className={styles.buttonsWrapper}>
          <button onClick={goToPrevStep} className={styles.prevButton} type="button">
            {`<`}
          </button>
          <button onClick={goToNextStep} className={styles.nextButton} disabled={this.getDisabledState()} type="button">
            Next >
          </button>
        </div>
      );
    }
  };

  private getStepDescription = (currentStep: ARTICLE_EVALUATION_STEP) => {
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
  };

  private getScoreGraph = () => {
    const { articleShow, handleClickScore } = this.props;
    const scoreNode = [];
    const { currentStep } = articleShow;

    function getClassName(score: number) {
      switch (currentStep) {
        case ARTICLE_EVALUATION_STEP.FIRST: {
          if (articleShow.myOriginalityScore && articleShow.myOriginalityScore === score) {
            return `${styles.scoreItem} ${styles.activeScore}`;
          } else {
            return styles.scoreItem;
          }
        }

        case ARTICLE_EVALUATION_STEP.SECOND: {
          if (articleShow.mySignificanceScore && articleShow.mySignificanceScore === score) {
            return `${styles.scoreItem} ${styles.activeScore}`;
          } else {
            return styles.scoreItem;
          }
        }

        case ARTICLE_EVALUATION_STEP.THIRD: {
          if (articleShow.myValidityScore && articleShow.myValidityScore === score) {
            return `${styles.scoreItem} ${styles.activeScore}`;
          } else {
            return styles.scoreItem;
          }
        }

        case ARTICLE_EVALUATION_STEP.FOURTH: {
          if (articleShow.myOrganizationScore && articleShow.myOrganizationScore === score) {
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
            handleClickScore(currentStep, i);
          }}
          className={getClassName(i)}
          key={`scoreNode_${i}`}
        >
          {i}
        </span>,
      );
    }

    return <div className={styles.scoreGraphWrapper}>{scoreNode}</div>;
  };

  private handleClickStartEvaluationButton = () => {
    this.setState({
      isInitial: false,
    });
  };

  private getInitialBox = () => {
    return (
      <div className={styles.initialBoxWrapper}>
        <div className={styles.initialBoxContent}>
          {`Do you have feedback or comment on this article?\nLeave your review!`}
        </div>
        <div onClick={this.handleClickStartEvaluationButton} className={styles.startEvaluationButton}>
          <span>Start Review!</span>
        </div>
      </div>
    );
  };

  public componentWillReceiveProps(nextProps: IMyEvaluationProps) {
    if (this.props.article.id !== nextProps.article.id) {
      this.setState({
        isInitial: true,
      });
    }
  }

  public render() {
    const { articleShow, handleSubmitEvaluation, currentUser, handleReviewChange } = this.props;
    const { isInitial } = this.state;

    if (isInitial) {
      return this.getInitialBox();
    }

    if (articleShow.currentStep === ARTICLE_EVALUATION_STEP.FIFTH) {
      return (
        <div className={styles.contentWrapper}>
          <ReviewInput currentUser={currentUser} articleShow={articleShow} handleReviewChange={handleReviewChange} />
          <form onFocus={checkAuthDialog} onSubmit={handleSubmitEvaluation} className={styles.formContainer}>
            {this.getButtons()}
          </form>
        </div>
      );
    } else {
      return (
        <div className={styles.contentWrapper}>
          <div className={styles.upperContent}>
            <EvaluateStep articleShow={articleShow} />
            <div className={styles.stepDescriptionWrapper}>{this.getStepDescription(articleShow.currentStep)}</div>
            {this.getScoreGraph()}
          </div>
          <div onFocus={checkAuthDialog} className={styles.formContainer}>
            {this.getButtons()}
          </div>
        </div>
      );
    }
  }
}

export default MyEvaluation;
