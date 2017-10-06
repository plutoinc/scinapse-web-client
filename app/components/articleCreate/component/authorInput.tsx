import * as React from "react";
import { IAuthor } from "../../../model/author";
import Icon from "../../../icons/index";
import { List } from "immutable";

const styles = require("./authorInput.scss");

interface IAuthorInputProps {
  authors: List<IAuthor>;
  plusAuthorFunc: () => void;
  minusAuthorFunc: () => void;
  handleChangeAuthorName: (index: number, fullName: string) => void;
  handleChangeAuthorInstitution: (index: number, institution: string) => void;
}

const plusAuthorBtn = (props: IAuthorInputProps) => (
  <a onClick={props.plusAuthorFunc} className={styles.authorButtonIconWrapper}>
    <Icon icon="AUTHOR_PLUS_BUTTON" />
  </a>
);

const minusAuthorBtn = (props: IAuthorInputProps) => (
  <a onClick={props.minusAuthorFunc} className={styles.authorButtonIconWrapper}>
    <Icon icon="AUTHOR_MINUS_BUTTON" />
  </a>
);

const getButtons = (index: number, authorSize: number, props: IAuthorInputProps) => {
  if (index === authorSize - 1 && index > 0) {
    return (
      <div className={styles.authorButtonContainer}>
        {plusAuthorBtn(props)}
        {minusAuthorBtn(props)}
      </div>
    );
  } else if (index === authorSize - 1) {
    return <div>{plusAuthorBtn(props)}</div>;
  }
};

const AuthorInput = (props: IAuthorInputProps) => {
  const { authors } = props;
  const authorSize = authors.size;

  return (
    <div className={styles.authorsInputContainer}>
      {authors.map((author, index) => {
        return (
          <div key={"authorInput_" + index} className={styles.authorInputLine}>
            <div className={styles.authorIndex}>{index + 1}</div>
            <div className={styles.fullNameInputWrapper}>
              <input
                onChange={e => {
                  props.handleChangeAuthorName(index, e.currentTarget.value);
                }}
                placeholder="Full Name"
                className={`form-control ${styles.inputBox}`}
                value={author.name}
                type="text"
              />
            </div>
            <div className={styles.institutionInputWrapper}>
              <input
                value={author.organization}
                placeholder="Institution (Option)"
                className={`form-control ${styles.inputBox}`}
                type="text"
              />
            </div>
            {getButtons(index, authorSize, props)}
          </div>
        );
      })}
    </div>
  );
};

export default AuthorInput;

// function getCommentForm(props: IArticleEvaluateProps) {
//   const { articleShow } = props;

//   const inputValue = () => {
//     switch (articleShow.currentStep) {
//       case ARTICLE_EVALUATION_STEP.FIRST: {
//         return articleShow.myOriginalityComment;
//       }

//       case ARTICLE_EVALUATION_STEP.SECOND: {
//         return articleShow.myContributionComment;
//       }
//       case ARTICLE_EVALUATION_STEP.THIRD: {
//         return articleShow.myAnalysisComment;
//       }
//       case ARTICLE_EVALUATION_STEP.FOURTH: {
//         return articleShow.myExpressivenessComment;
//       }

//       default:
//         return "";
//     }
//   };

//   const { myOriginalityScore, myContributionScore, myAnalysisScore, myExpressivenessScore } = props.articleShow;
//   const canSubmit = !!myOriginalityScore && !!myContributionScore && !!myAnalysisScore && !!myExpressivenessScore;

//   if (props.articleShow.currentStep === ARTICLE_EVALUATION_STEP.FOURTH) {
//     return (
//       <div className={styles.inputWrapper}>
//         <input
//           onChange={e => {
//             props.handleEvaluationChange(props.articleShow.currentStep, e.currentTarget.value);
//           }}
//           value={inputValue()}
//           placeholder="Enter your comment(Option)"
//           className={styles.commentWrapper}
//         />
//         <GeneralButton
//           style={{
//             width: "129.5px",
//             height: "41.6px",
//           }}
//           type="submit"
//           disabled={!canSubmit}
//         >
//           Submit >
//         </GeneralButton>
//       </div>
//     );
//   } else {
//     return (
//       <div className={styles.inputWrapper}>
//         <input
//           onChange={e => {
//             props.handleEvaluationChange(props.articleShow.currentStep, e.currentTarget.value);
//           }}
//           value={inputValue()}
//           placeholder="Enter your comment(Option)"
//           className={styles.commentWrapper}
//         />
//         <GeneralButton
//           style={{
//             width: "129.5px",
//             height: "41.6px",
//           }}
//           type="button"
//           onClick={props.goToNextStep}
//         >
//           Next >
//         </GeneralButton>
//       </div>
//     );
//   }
// }

// function getScoreGraph(props: IArticleEvaluateProps) {
//   const scoreNode = [];
//   const { currentStep } = props.articleShow;

//   function getClassName(score: number) {
//     switch (currentStep) {
//       case ARTICLE_EVALUATION_STEP.FIRST: {
//         if (props.articleShow.myOriginalityScore && props.articleShow.myOriginalityScore === score) {
//           return `${styles.scoreItem} ${styles.activeScore}`;
//         } else {
//           return styles.scoreItem;
//         }
//       }

//       case ARTICLE_EVALUATION_STEP.SECOND: {
//         if (props.articleShow.myContributionScore && props.articleShow.myContributionScore === score) {
//           return `${styles.scoreItem} ${styles.activeScore}`;
//         } else {
//           return styles.scoreItem;
//         }
//       }

//       case ARTICLE_EVALUATION_STEP.THIRD: {
//         if (props.articleShow.myAnalysisScore && props.articleShow.myAnalysisScore === score) {
//           return `${styles.scoreItem} ${styles.activeScore}`;
//         } else {
//           return styles.scoreItem;
//         }
//       }

//       case ARTICLE_EVALUATION_STEP.FOURTH: {
//         if (props.articleShow.myExpressivenessScore && props.articleShow.myExpressivenessScore === score) {
//           return `${styles.scoreItem} ${styles.activeScore}`;
//         } else {
//           return styles.scoreItem;
//         }
//       }

//       default:
//         break;
//     }
//   }

//   for (let i = MIN_SCORE; i < MAX_SCORE + 1; i++) {
//     scoreNode.push(
//       <span
//         onClick={() => {
//           props.handleClickScore(currentStep, i);
//         }}
//         className={getClassName(i)}
//         key={`scoreNode_${i}`}
//       >
//         {i}
//       </span>,
//     );
//   }

//   return <div className={styles.scoreGraphWrapper}>{scoreNode}</div>;
// }

// function getMyEvaluationComponent(props: IArticleEvaluateProps) {
//   if (props.articleShow.currentStep === ARTICLE_EVALUATION_STEP.FINAL) {
//     return <EvaluationFinalStep articleShow={props.articleShow} currentUser={props.currentUser} />;
//   }

//   return (
//     <div className={styles.contentWrapper}>
//       <EvaluateStep articleShow={props.articleShow} handleClickStepButton={props.handleClickStepButton} />
//       <div className={styles.stepDescriptionWrapper}>
//         Is the research proposition, method of study, object of observation, or form of overall statement unique and
//         distinct from previous research?
//       </div>
//       {getScoreGraph(props)}
//       <form onSubmit={props.handleSubmitEvaluation} className={styles.commentInputWrapper}>
//         {getCommentForm(props)}
//       </form>
//     </div>
//   );
// }

// function mapEvaluations(props: IArticleEvaluateProps) {
//   return props.article.evaluations.map((evaluation, index) => {
//     return (
//       <PeerEvaluation
//         id={evaluation.createdAt + index}
//         key={evaluation.createdAt + index}
//         evaluation={evaluation}
//         handleTogglePeerEvaluation={props.handleTogglePeerEvaluation}
//         currentUser={props.currentUser}
//         articleShow={props.articleShow}
//         handlePeerEvaluationCommentSubmit={props.handlePeerEvaluationCommentSubmit}
//       />
//     );
//   });
// }

// function getEvaluationComponent(props: IArticleEvaluateProps) {
//   if (props.articleShow.evaluationTab === ARTICLE_EVALUATION_TAB.MY) {
//     return getMyEvaluationComponent(props);
//   } else {
//     return mapEvaluations(props);
//   }
// }

// const tabContainerStyle = {
//   width: 360,
//   backgroundColor: "transparent",
// };

// const tabStyle = {
//   width: 180,
//   fontSize: "16.5px",
//   lineHeight: 1.52,
//   color: "#0c1020",
// };
