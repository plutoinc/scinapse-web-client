import * as React from "react";
import { IArticleCreateStateRecord, ARTICLE_CREATE_STEP } from "./records";
import { connect, DispatchProp } from "react-redux";
import { Step, Stepper, StepContent, StepLabel } from "material-ui/Stepper";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import * as Actions from "./actions";
import { IAppState } from "../../reducers";

const styles = require("./articleCreate.scss");

interface IArticleCreateContainerProps extends DispatchProp<IArticleCreateContainerMappedState> {
  articleCreateState: IArticleCreateStateRecord;
}

interface IArticleCreateContainerMappedState {
  articleCreateState: IArticleCreateStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    articleCreateState: state.articleCreate,
  };
}

const stepContentStyle = {
  marginLeft: 29,
  paddingLeft: 37.5,
  marginTop: -7,
};

class ArticleCreate extends React.PureComponent<IArticleCreateContainerProps, null> {
  private handleNext = () => {
    const { dispatch, articleCreateState } = this.props;
    const { currentStep } = articleCreateState;

    dispatch(Actions.changeCreateStep(currentStep + 1));
  };

  private handlePrev = () => {
    const { dispatch, articleCreateState } = this.props;
    const { currentStep } = articleCreateState;

    if (currentStep > 0) {
      dispatch(Actions.changeCreateStep(currentStep - 1));
    }
  };

  private renderStepActions(step: ARTICLE_CREATE_STEP) {
    const { articleCreateState } = this.props;
    const { currentStep } = articleCreateState;

    return (
      <div className={styles.stepBtns}>
        <div onClick={this.handleNext} className={styles.nextBtn}>
          {currentStep === ARTICLE_CREATE_STEP.FINAL ? "Finish" : "Next"}
        </div>
        {step > ARTICLE_CREATE_STEP.FIRST && (
          <div onClick={this.handlePrev} className={styles.backBtn}>
            Back
          </div>
        )}
      </div>
    );
  }

  render() {
    const { articleCreateState } = this.props;

    return (
      <div className={styles.articleCreateContainer}>
        <div className={styles.articleEditorBackground} />
        <div className={styles.innerContainer}>
          <div className={styles.title}>Submit Your Article</div>
          <div className={styles.content}>
            Share OA papers, white papers, and tech blog articles about crypto currency<br /> on Pluto that you want to
            evaluate or discuss.
          </div>
          <div className={styles.formContainer}>
            <div className={styles.innerContainer}>
              <Stepper activeStep={articleCreateState.currentStep} orientation="vertical">
                <Step>
                  <StepLabel>Please enter the original article link</StepLabel>
                  <StepContent style={stepContentStyle}>
                    <div className={styles.articleLinkContent}>Article Link</div>
                    <div className={styles.articleLinkInputWrapper}>
                      <input placeholder="https://" className={`form-control ${styles.inputBox}`} type="url" />
                    </div>
                    {this.renderStepActions(ARTICLE_CREATE_STEP.FIRST)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Please enter the article information</StepLabel>
                  <StepContent style={stepContentStyle}>
                    <div className={styles.articleLinkContent}>Article Category</div>
                    <DropDownMenu value="Select Category" openImmediately={true}>
                      <MenuItem value={1} primaryText="Never" />
                      <MenuItem value={2} primaryText="Every Night" />
                      <MenuItem value={3} primaryText="Weeknights" />
                      <MenuItem value={4} primaryText="Weekends" />
                      <MenuItem value={5} primaryText="Weekly" />
                    </DropDownMenu>
                    <div className={styles.articleLinkInputWrapper}>
                      <input placeholder="https://" className={`form-control ${styles.inputBox}`} type="url" />
                    </div>
                    {this.renderStepActions(ARTICLE_CREATE_STEP.SECOND)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Please enter the note for evaluator (Option) </StepLabel>
                  <StepContent style={stepContentStyle}>
                    <div className={styles.articleLinkContent}>Article Link</div>
                    <div className={styles.articleLinkInputWrapper}>
                      <input placeholder="https://" className={`form-control ${styles.inputBox}`} type="url" />
                    </div>
                    {this.renderStepActions(ARTICLE_CREATE_STEP.FINAL)}
                  </StepContent>
                </Step>
              </Stepper>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleCreate);
