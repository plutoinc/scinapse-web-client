import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Step, Stepper, StepContent } from "material-ui/Stepper";
import { throttle } from "lodash";

import { IArticleCreateStateRecord, ARTICLE_CREATE_STEP, ARTICLE_CATEGORY } from "./records";
import * as Actions from "./actions";
import { IAppState } from "../../reducers";
import Icon from "../../icons";
import { InputBox } from "../common/inputBox/inputBox";

// Components
import AuthorInput from "./component/authorInput";

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
    const nextBtnContent = currentStep === ARTICLE_CREATE_STEP.FINAL ? "Finish" : "Next";

    return (
      <div className={styles.stepBtns}>
        {articleCreateState.validEachStep.get(step) === true ? (
          <div onClick={this.handleNext} className={styles.nextBtn}>
            {nextBtnContent}
          </div>
        ) : (
          <div className={styles.deActiveNextBtn}>{nextBtnContent}</div>
        )}
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

  private checkValidArticleCategory = (category: ARTICLE_CATEGORY) => {
    const { dispatch } = this.props;

    dispatch(Actions.checkValidArticleCategory(category));
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

  private getDropDownMenuItem = (category: ARTICLE_CATEGORY) => (
    <div
      className={styles.dropDownMenuItemWrapper}
      onClick={() => {
        this.toggleArticleCategoryDropDown();
        this.selectArticleCategory(category);
        this.checkValidArticleCategory(category);
        this.handleCheckValidateStep(ARTICLE_CREATE_STEP.SECOND);
      }}
    >
      {category}
    </div>
  );

  private getDropDownMenuContainer = () => {
    const { articleCreateState } = this.props;

    if (articleCreateState.isArticleCategoryDropDownOpen) {
      return (
        <div className={styles.dropDownMenuContainer}>
          {this.getDropDownMenuItem("Post Paper")}
          {this.getDropDownMenuItem("Pre Paper")}
          {this.getDropDownMenuItem("White Paper")}
          {this.getDropDownMenuItem("Tech Blog")}
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

  private checkValidArticleLink = (articleLink: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.checkValidArticleLink(articleLink));
  };

  private handleChangeArticleTitle = (articleTitle: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeArticleTitle(articleTitle));
  };

  private checkValidArticleTitle = (articleTitle: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.checkValidArticleTitle(articleTitle));
  };

  private handleChangeAuthorName = (index: number, name: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAuthorName(index, name));
  };

  private checkValidAuthorName = (index: number, name: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.checkValidAuthorName(index, name));
  };

  private handleChangeAuthorInstitution = (index: number, institution: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAuthorInstitution(index, institution));
  };

  private checkValidAuthorInstitution = (index: number, institution: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.checkValidAuthorInstitution(index, institution));
  };

  private handleChangeAbstract = (abstract: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAbstract(abstract));
  };

  private checkValidAbstract = (abstract: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.checkValidAbstract(abstract));
  };

  private handleChangeNote = (note: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeNote(note));
  };

  private checkValidateStep = (nowStep: ARTICLE_CREATE_STEP) => {
    const { dispatch, articleCreateState } = this.props;

    dispatch(Actions.checkValidateStep(nowStep, articleCreateState));
  };

  private handleCheckValidateStep = throttle(this.checkValidateStep, 500);

  render() {
    const {
      articleLink,
      articleCategory,
      authors,
      authorInputErrorIndex,
      authorInputErrorType,
      currentStep,
      errorType,
    } = this.props.articleCreateState;
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
                    <InputBox
                      onChangeFunc={(articleLink: string) => {
                        this.handleChangeArticleLink(articleLink);
                        this.checkValidArticleLink(articleLink);
                        this.handleCheckValidateStep(ARTICLE_CREATE_STEP.FIRST);
                      }}
                      type="normal"
                      defaultValue={articleLink}
                      placeHolder="https://"
                      hasError={errorType === "articleLink"}
                    />
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
                      className={
                        errorType === "articleCategory"
                          ? `${styles.hasError} ${styles.articleCategoryBtn}`
                          : styles.articleCategoryBtn
                      }
                      onClick={() => {
                        this.toggleArticleCategoryDropDown();
                        this.handleCheckValidateStep(ARTICLE_CREATE_STEP.SECOND);
                      }}
                    >
                      <div className={styles.categoryContent}>
                        {articleCategory === null ? "Select Category" : articleCategory}
                      </div>
                      {this.getArrowPointIcon()}
                    </div>
                    {this.getDropDownMenuContainer()}
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Article Title
                    </div>
                    <InputBox
                      onChangeFunc={(articleTitle: string) => {
                        this.handleChangeArticleTitle(articleTitle);
                        this.checkValidArticleTitle(articleTitle);
                        this.handleCheckValidateStep(ARTICLE_CREATE_STEP.SECOND);
                      }}
                      type="normal"
                      hasError={errorType === "articleTitle"}
                    />
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Authors
                    </div>
                    <AuthorInput
                      authors={authors}
                      authorInputErrorIndex={authorInputErrorIndex}
                      authorInputErrorType={authorInputErrorType}
                      plusAuthorFunc={this.plusAuthorFunc}
                      minusAuthorFunc={this.minusAuthorFunc}
                      handleChangeAuthorName={this.handleChangeAuthorName}
                      checkValidAuthorName={this.checkValidAuthorName}
                      handleChangeAuthorInstitution={this.handleChangeAuthorInstitution}
                      checkValidAuthorInstitution={this.checkValidAuthorInstitution}
                      validateFunc={() => {
                        this.handleCheckValidateStep(ARTICLE_CREATE_STEP.SECOND);
                      }}
                    />
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Abstract <span style={{ fontWeight: 300 }}>or Summary</span>
                    </div>
                    <InputBox
                      onChangeFunc={(abstract: string) => {
                        this.handleChangeAbstract(abstract);
                        this.checkValidAbstract(abstract);
                        this.handleCheckValidateStep(ARTICLE_CREATE_STEP.SECOND);
                      }}
                      type="textarea"
                      hasError={errorType === "abstract"}
                    />
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
                    <InputBox onChangeFunc={this.handleChangeNote} type="textarea" />
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
