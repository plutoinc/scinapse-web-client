import * as React from "react";
import { IArticleCreateStateRecord, ARTICLE_CREATE_STEP, ARTICLE_CATEGORY } from "./records";
import { connect, DispatchProp } from "react-redux";
import { Step, Stepper, StepContent } from "material-ui/Stepper";
import * as Actions from "./actions";
import { IAppState } from "../../reducers";
import Icon from "../../icons";

import AuthorInput from "./component/authorInput";
import { InputBox } from "../common/inputBox/inputBox";
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
  marginLeft: 15,
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

  private renderStepActions = (step: ARTICLE_CREATE_STEP) => {
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
  };

  private selectArticleCategory = (category: ARTICLE_CATEGORY) => {
    const { dispatch } = this.props;

    dispatch(Actions.selectArticleCategory(category));
  };

  private toggleArticleCategoryDropDown = () => {
    const { dispatch } = this.props;

    dispatch(Actions.toggleArticleCategoryDropDown());
  };

  private getArrowPointIcon = () => {
    const { articleCreateState } = this.props;

    if (!articleCreateState.isArticleCategoryDropDownOpen) {
      return (
        <div className={styles.arrowPointIconWrapper}>
          <Icon icon="ARROW_POINT_TO_DOWN" />
        </div>
      );
    } else {
      return (
        <div className={styles.arrowPointIconWrapper}>
          <Icon icon="ARROW_POINT_TO_UP" />
        </div>
      );
    }
  };

  private getDropDownMenuContainer = () => {
    const { articleCreateState } = this.props;

    if (articleCreateState.isArticleCategoryDropDownOpen) {
      return (
        <div className={styles.dropDownMenuContainer}>
          <div
            className={styles.dropDownMenuItemWrapper}
            onClick={() => {
              this.toggleArticleCategoryDropDown();
              this.selectArticleCategory("Post Paper");
            }}
          >
            Post Paper
          </div>
          <div
            className={styles.dropDownMenuItemWrapper}
            onClick={() => {
              this.toggleArticleCategoryDropDown();
              this.selectArticleCategory("Pre Paper");
            }}
          >
            Pre Paper
          </div>
          <div
            className={styles.dropDownMenuItemWrapper}
            onClick={() => {
              this.toggleArticleCategoryDropDown();
              this.selectArticleCategory("White Paper");
            }}
          >
            White Paper
          </div>
          <div
            className={styles.dropDownMenuItemWrapper}
            onClick={() => {
              this.toggleArticleCategoryDropDown();
              this.selectArticleCategory("Tech Blog");
            }}
          >
            Tech Blog
          </div>
        </div>
      );
    }
  };

  private getStepIcon = (step: ARTICLE_CREATE_STEP) => {
    const { currentStep } = this.props.articleCreateState;

    if (step === currentStep) {
      return <div className={styles.stepNumber}>{step + 1}</div>;
    } else if (step < currentStep) {
      return (
        <div className={styles.checkedStepIconWrapper}>
          <Icon icon="CHECKED_STEP" />
        </div>
      );
    } else {
      return <div className={`${styles.stepNumber} ${styles.deActive}`}>{step + 1}</div>;
    }
  };

  private plusAuthorFunc = () => {
    const { dispatch } = this.props;

    dispatch(Actions.plusAuthor());
  };

  private minusAuthorFunc = () => {
    const { dispatch } = this.props;

    dispatch(Actions.minusAuthor());
  };

  private handleChangeArticleLink = (articleLink: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeArticleLink(articleLink));
  };

  private handleChangeArticleTitle = (articleTitle: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeArticleTitle(articleTitle));
  };

  private handleChangeAuthorName = (index: number, fullName: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAuthorName(index, fullName));
  };

  private handleChangeAuthorInstitution = (index: number, institution: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAuthorInstitution(index, institution));
  };

  private handleChangeAbstract = (abstract: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAbstract(abstract));
  };

  private handleChangeNote = (note: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeNote(note));
  };

  render() {
    const { articleCategory, authors, currentStep } = this.props.articleCreateState;
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
              <Stepper activeStep={currentStep} orientation="vertical">
                <Step>
                  <div className={styles.stepLabel}>
                    {this.getStepIcon(ARTICLE_CREATE_STEP.FIRST)}
                    <div className={styles.stepLabelTitle}>Please enter the original article link</div>
                  </div>
                  <StepContent style={stepContentStyle}>
                    <div className={styles.smallTitle}>Article Link</div>
                    <InputBox onChangeFunc={this.handleChangeArticleLink} type="long" placeHolder="https://" />
                    {this.renderStepActions(ARTICLE_CREATE_STEP.FIRST)}
                  </StepContent>
                </Step>
                <Step>
                  <div className={styles.stepLabel}>
                    {this.getStepIcon(ARTICLE_CREATE_STEP.SECOND)}
                    <div className={styles.stepLabelTitle}>Please enter the article information</div>
                  </div>
                  <StepContent style={stepContentStyle}>
                    <div className={styles.smallTitle}>Article Category</div>
                    <div
                      className={styles.articleCategoryBtn}
                      onClick={() => {
                        this.toggleArticleCategoryDropDown();
                      }}
                    >
                      {articleCategory === null ? "Select Category" : articleCategory}
                      {this.getArrowPointIcon()}
                    </div>
                    {this.getDropDownMenuContainer()}
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Article Title
                    </div>
                    <InputBox onChangeFunc={this.handleChangeArticleTitle} type="long" />
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Authors
                    </div>
                    <AuthorInput
                      authors={authors}
                      plusAuthorFunc={this.plusAuthorFunc}
                      minusAuthorFunc={this.minusAuthorFunc}
                      handleChangeAuthorInstitution={this.handleChangeAuthorInstitution}
                      handleChangeAuthorName={this.handleChangeAuthorName}
                    />
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Abstract or Summary
                    </div>
                    <InputBox onChangeFunc={this.handleChangeAbstract} type="big" />
                    {this.renderStepActions(ARTICLE_CREATE_STEP.SECOND)}
                  </StepContent>
                </Step>
                <Step>
                  <div className={styles.stepLabel}>
                    {this.getStepIcon(ARTICLE_CREATE_STEP.FINAL)}
                    <div className={styles.stepLabelTitle}>Please enter the note for evaluator (Option) </div>
                  </div>
                  <StepContent style={stepContentStyle}>
                    <div className={styles.articleLinkContent}>Notes to evaluator</div>
                    <InputBox onChangeFunc={this.handleChangeNote} type="big" />
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
