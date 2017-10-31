import * as React from "react";
import { IArticleShowStateRecord, ARTICLE_EVALUATION_STEP } from "../../records";
import EvaluateStep from "../evaluate/evaluateStep";
import AutoSizeTextarea from "../../../common/autoSizeTextarea";
import GeneralButton from "../../../common/buttons/general";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { IArticleRecord } from "../../../../model/article";
const styles = require("../evaluate/evaluate.scss");

interface IMyEvaluationProps {
  articleShow: IArticleShowStateRecord;
  article: IArticleRecord;
  handleClickScore: (step: ARTICLE_EVALUATION_STEP, score: number) => void;
  handleEvaluationChange: (step: ARTICLE_EVALUATION_STEP, comment: string) => void;
  goToNextStep: () => void;
  handleClickStepButton: (step: ARTICLE_EVALUATION_STEP) => void;
  handleSubmitEvaluation: (e: React.FormEvent<HTMLFormElement>) => void;
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

  private getPlaceholder = (step: ARTICLE_EVALUATION_STEP) => {
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
  };

  private getCommentForm = () => {
    const { articleShow, handleEvaluationChange, goToNextStep } = this.props;

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

    const { myOriginalityScore, mySignificanceScore, myValidityScore, myOrganizationScore } = articleShow;
    const canSubmit = !!myOriginalityScore && !!mySignificanceScore && !!myValidityScore && !!myOrganizationScore;
    const TextArea = (
      <AutoSizeTextarea
        onChange={e => {
          e.preventDefault();
          handleEvaluationChange(articleShow.currentStep, e.currentTarget.value);
        }}
        value={inputValue()}
        placeholder={this.getPlaceholder(articleShow.currentStep)}
        className={styles.commentWrapper}
      />
    );

    if (articleShow.currentStep === ARTICLE_EVALUATION_STEP.FOURTH) {
      return (
        <div className={styles.inphandleSubmitEvaluationutWrapper}>
          {TextArea}
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
          {TextArea}
          <GeneralButton
            style={{
              width: "129.5px",
              height: "41.6px",
            }}
            type="button"
            onClick={goToNextStep}
            disabled={this.getDisabledState()}
          >
            Next >
          </GeneralButton>
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
          {`Do you have feedback or comment on this article?\nLeave your evaluation!`}
        </div>
        <div onClick={this.handleClickStartEvaluationButton} className={styles.startEvaluationButton}>
          <span>Start Evaluation!</span>
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
    const { articleShow, handleClickStepButton, handleSubmitEvaluation } = this.props;
    const { isInitial } = this.state;

    if (isInitial) {
      return this.getInitialBox();
    }

    return (
      <div className={styles.contentWrapper}>
        <EvaluateStep articleShow={articleShow} handleClickStepButton={handleClickStepButton} />
        <div className={styles.stepDescriptionWrapper}>{this.getStepDescription(articleShow.currentStep)}</div>
        {this.getScoreGraph()}
        <form onFocus={checkAuthDialog} onSubmit={handleSubmitEvaluation} className={styles.commentInputWrapper}>
          {this.getCommentForm()}
        </form>
      </div>
    );
  }
}

export default MyEvaluation;
