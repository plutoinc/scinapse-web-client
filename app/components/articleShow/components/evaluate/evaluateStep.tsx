import * as React from "react";
import { Step, StepButton } from "material-ui/Stepper";
const Stepper = require("material-ui/Stepper").Stepper;
import { ARTICLE_EVALUATION_STEP, IArticleShowStateRecord } from "../../records";
const styles = require("./evaluate.scss");

export interface IEvaluateStepProps {
  articleShow: IArticleShowStateRecord;
  handleClickStepButton: (step: ARTICLE_EVALUATION_STEP) => void;
}

const stepStyle: React.CSSProperties = {
  flex: 1,
};

const stepButtonStyle: React.CSSProperties = {
  width: "175px",
  padding: 0,
};

const activeStepButtonStyle: React.CSSProperties = {
  ...stepButtonStyle,
  ...{
    backgroundColor: "#f5f7fb",
  },
};

const EvaluateStep = (props: IEvaluateStepProps) => {
  const { currentStep } = props.articleShow;

  return (
    <div className={styles.stepWrapper}>
      <Stepper style={{ fontFamily: "SpoqaHanSans" }} linear={false} connector={null}>
        <Step
          style={stepStyle}
          completed={currentStep >= ARTICLE_EVALUATION_STEP.FIRST}
          active={currentStep === ARTICLE_EVALUATION_STEP.FIRST}
        >
          <StepButton
            style={currentStep >= ARTICLE_EVALUATION_STEP.FIRST ? activeStepButtonStyle : stepButtonStyle}
            icon={null}
            onClick={() => {
              props.handleClickStepButton(ARTICLE_EVALUATION_STEP.FIRST);
            }}
          >
            <div
              className={
                currentStep >= ARTICLE_EVALUATION_STEP.FIRST
                  ? `${styles.stepButtonContent} ${styles.activeStep}`
                  : styles.stepButtonContent
              }
            >
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepTitle}>Originality</div>
            </div>
          </StepButton>
        </Step>
        <Step
          style={stepStyle}
          completed={currentStep >= ARTICLE_EVALUATION_STEP.SECOND}
          active={currentStep === ARTICLE_EVALUATION_STEP.SECOND}
        >
          <StepButton
            style={currentStep >= ARTICLE_EVALUATION_STEP.SECOND ? activeStepButtonStyle : stepButtonStyle}
            icon={null}
            onClick={() => {
              props.handleClickStepButton(ARTICLE_EVALUATION_STEP.SECOND);
            }}
          >
            <div
              className={
                currentStep >= ARTICLE_EVALUATION_STEP.SECOND
                  ? `${styles.stepButtonContent} ${styles.activeStep}`
                  : styles.stepButtonContent
              }
            >
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepTitle}>Contribution</div>
            </div>
          </StepButton>
        </Step>
        <Step
          style={stepStyle}
          completed={currentStep >= ARTICLE_EVALUATION_STEP.THIRD}
          active={currentStep === ARTICLE_EVALUATION_STEP.THIRD}
        >
          <StepButton
            style={currentStep >= ARTICLE_EVALUATION_STEP.THIRD ? activeStepButtonStyle : stepButtonStyle}
            icon={null}
            onClick={() => {
              props.handleClickStepButton(ARTICLE_EVALUATION_STEP.THIRD);
            }}
          >
            <div
              className={
                currentStep >= ARTICLE_EVALUATION_STEP.THIRD
                  ? `${styles.stepButtonContent} ${styles.activeStep}`
                  : styles.stepButtonContent
              }
            >
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepTitle}>Analysis</div>
            </div>
          </StepButton>
        </Step>
        <Step
          style={stepStyle}
          completed={currentStep >= ARTICLE_EVALUATION_STEP.FOURTH}
          active={currentStep === ARTICLE_EVALUATION_STEP.FOURTH}
        >
          <StepButton
            style={currentStep >= ARTICLE_EVALUATION_STEP.FOURTH ? activeStepButtonStyle : stepButtonStyle}
            icon={null}
            onClick={() => {
              props.handleClickStepButton(ARTICLE_EVALUATION_STEP.FOURTH);
            }}
          >
            <div
              className={
                currentStep >= ARTICLE_EVALUATION_STEP.FOURTH
                  ? `${styles.stepButtonContent} ${styles.activeStep}`
                  : styles.stepButtonContent
              }
            >
              <div className={styles.stepNumber}>04</div>
              <div className={styles.stepTitle}>Expressiveness</div>
            </div>
          </StepButton>
        </Step>
      </Stepper>
    </div>
  );
};

export default EvaluateStep;
