import * as React from "react";
import { IArticleShowStateRecord, ARTICLE_REVIEW_STEP } from "../../records";
import ReviewStep from "../review/reviewStep";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { IArticleRecord } from "../../../../model/article";
import ReviewInput from "../review/reviewInput";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import Icon from "../../../../icons";

const styles = require("../review/review.scss");

export interface IMyReviewProps {
  articleShow: IArticleShowStateRecord;
  currentUser: ICurrentUserRecord;
  article: IArticleRecord;
  handleClickScore: (step: ARTICLE_REVIEW_STEP, score: number) => void;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  handleSubmitReview: (e: React.FormEvent<HTMLFormElement>) => void;
  handleReviewChange: (review: string) => void;
}

interface IMyReviewState {
  isInitial: boolean;
}

const MIN_SCORE = 1;
const MAX_SCORE = 10;

class MyReview extends React.PureComponent<IMyReviewProps, IMyReviewState> {
  public constructor(props: IMyReviewProps) {
    super(props);

    this.state = {
      isInitial: true,
    };
  }

  private getDisabledState = () => {
    const { articleShow } = this.props;
    const { currentStep } = articleShow;

    switch (currentStep) {
      case ARTICLE_REVIEW_STEP.FIRST: {
        if (!articleShow.myOriginalityScore) {
          return true;
        } else {
          return false;
        }
      }

      case ARTICLE_REVIEW_STEP.SECOND: {
        if (!articleShow.mySignificanceScore) {
          return true;
        } else {
          return false;
        }
      }

      case ARTICLE_REVIEW_STEP.THIRD: {
        if (!articleShow.myValidityScore) {
          return true;
        } else {
          return false;
        }
      }

      case ARTICLE_REVIEW_STEP.FOURTH: {
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

    if (articleShow.currentStep === ARTICLE_REVIEW_STEP.FIFTH) {
      return (
        <div className={styles.buttonsWrapper}>
          <button onClick={goToPrevStep} className={styles.prevButton} type="button">
            <Icon icon="REVIEW_BACK_STEP" />
          </button>
          <button className={styles.nextButton} disabled={!canSubmit} type="submit">
            Submit >
          </button>
        </div>
      );
    } else if (articleShow.currentStep === ARTICLE_REVIEW_STEP.FIRST) {
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
            <Icon icon="REVIEW_BACK_STEP" />
          </button>
          <button onClick={goToNextStep} className={styles.nextButton} disabled={this.getDisabledState()} type="button">
            Next >
          </button>
        </div>
      );
    }
  };

  private getStepDescription = (currentStep: ARTICLE_REVIEW_STEP) => {
    switch (currentStep) {
      case ARTICLE_REVIEW_STEP.FIRST: {
        return `Are the ideas, methods, and objects of research unique and distinct from existing research? Does the research contain only original contents and completely avoid plagiarism?`;
      }

      case ARTICLE_REVIEW_STEP.SECOND: {
        return `Does the research contribute to academic progress and development? Does it provide insight to understand and build theoretical systems for new phenomena? Does it have potential for further research?`;
      }

      case ARTICLE_REVIEW_STEP.THIRD: {
        return `Is the research reliable and valid? Is the research accurate and error-free in the process? Is there a clear description of research methods, conditions and tools to prove reproducibility?`;
      }

      case ARTICLE_REVIEW_STEP.FOURTH: {
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
        case ARTICLE_REVIEW_STEP.FIRST: {
          if (articleShow.myOriginalityScore && articleShow.myOriginalityScore === score) {
            return `${styles.scoreItem} ${styles.activeScore}`;
          } else {
            return styles.scoreItem;
          }
        }

        case ARTICLE_REVIEW_STEP.SECOND: {
          if (articleShow.mySignificanceScore && articleShow.mySignificanceScore === score) {
            return `${styles.scoreItem} ${styles.activeScore}`;
          } else {
            return styles.scoreItem;
          }
        }

        case ARTICLE_REVIEW_STEP.THIRD: {
          if (articleShow.myValidityScore && articleShow.myValidityScore === score) {
            return `${styles.scoreItem} ${styles.activeScore}`;
          } else {
            return styles.scoreItem;
          }
        }

        case ARTICLE_REVIEW_STEP.FOURTH: {
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

  private handleClickStartReviewButton = () => {
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
        <div onClick={this.handleClickStartReviewButton} className={styles.startReviewButton}>
          <span>Start Review!</span>
        </div>
      </div>
    );
  };

  public componentWillReceiveProps(nextProps: IMyReviewProps) {
    if (this.props.article.id !== nextProps.article.id) {
      this.setState({
        isInitial: true,
      });
    }
  }

  public render() {
    const { articleShow, handleSubmitReview, currentUser, handleReviewChange } = this.props;
    const { isInitial } = this.state;

    if (isInitial) {
      return this.getInitialBox();
    }

    if (articleShow.currentStep === ARTICLE_REVIEW_STEP.FIFTH) {
      return (
        <div className={styles.contentWrapper}>
          <ReviewInput currentUser={currentUser} articleShow={articleShow} handleReviewChange={handleReviewChange} />
          <form onFocus={checkAuthDialog} onSubmit={handleSubmitReview} className={styles.formContainer}>
            {this.getButtons()}
          </form>
        </div>
      );
    } else {
      return (
        <div className={styles.contentWrapper}>
          <div className={styles.upperContent}>
            <ReviewStep articleShow={articleShow} />
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

export default MyReview;
