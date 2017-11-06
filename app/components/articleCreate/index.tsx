import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Step, Stepper, StepContent } from "material-ui/Stepper";

import { IArticleCreateStateRecord, ARTICLE_CREATE_STEP, ARTICLE_CATEGORY, AUTHOR_NAME_TYPE } from "./records";
import * as Actions from "./actions";
import { IAppState } from "../../reducers";
import Icon from "../../icons";
import { InputBox } from "../common/inputBox/inputBox";
import AuthorInput from "./component/authorInput";
import { ICurrentUserRecord } from "../../model/currentUser";
import { push } from "react-router-redux";
import { Prompt } from "react-router-dom";
import { initialArticleLinkInput } from "./records";

const styles = require("./articleCreate.scss");

interface IArticleCreateContainerProps extends DispatchProp<IArticleCreateContainerMappedState> {
  articleCreateState: IArticleCreateStateRecord;
  currentUserState: ICurrentUserRecord;
}

interface IArticleCreateContainerMappedState {
  articleCreateState: IArticleCreateStateRecord;
  currentUserState: ICurrentUserRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    articleCreateState: state.articleCreate,
    currentUserState: state.currentUser,
  };
}

const stepContentStyle = {
  marginLeft: 15,
  paddingLeft: 37.5,
  marginTop: -7,
};

class ArticleCreate extends React.PureComponent<IArticleCreateContainerProps, null> {
  public componentDidMount() {
    const { currentUserState, dispatch } = this.props;
    const isLoggedIn = currentUserState.isLoggedIn;

    if (!isLoggedIn) {
      alert("You have to sign in first before create article.");
      dispatch(push("/users/sign_in"));
    }
  }

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
        <div
          onClick={() => {
            this.checkValidateStep(step);
          }}
          className={styles.nextBtn}
        >
          {nextBtnContent}
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

  private getDropDownMenuItem = (category: ARTICLE_CATEGORY, content: string) => (
    <div
      className={styles.dropDownMenuItemWrapper}
      onClick={() => {
        this.toggleArticleCategoryDropDown();
        this.selectArticleCategory(category);
        this.checkValidArticleCategory(category);
      }}
    >
      {content}
    </div>
  );

  private getDropDownMenuContainer = () => {
    const { articleCreateState } = this.props;

    if (articleCreateState.isArticleCategoryDropDownOpen) {
      return (
        <div className={styles.dropDownMenuContainer}>
          {this.getDropDownMenuItem("POST_PAPER", "Post Paper")}
          {this.getDropDownMenuItem("PRE_PAPER", "Pre Paper")}
          {this.getDropDownMenuItem("WHITE_PAPER", "White Paper")}
          {this.getDropDownMenuItem("TECH_BLOG", "Tech Blog")}
        </div>
      );
    }
  };

  private getStepIcon = (step: ARTICLE_CREATE_STEP) => {
    const { dispatch, articleCreateState } = this.props;
    const { currentStep } = articleCreateState;

    if (step === currentStep) {
      return <div className={styles.stepNumber}>{step + 1}</div>;
    } else if (step < currentStep) {
      return (
        <div
          onClick={() => {
            dispatch(Actions.changeCreateStep(step));
          }}
          className={styles.checkedStepIconWrapper}
        >
          <Icon icon="CHECKED_STEP" />
        </div>
      );
    } else {
      return <div className={`${styles.stepNumber} ${styles.deActive}`}>{step + 1}</div>;
    }
  };

  private getArticleCategoryContent = (articleCategory: ARTICLE_CATEGORY) => {
    let articleCategoryContent: string;
    switch (articleCategory) {
      case "POST_PAPER":
        articleCategoryContent = "Post Paper";
        break;
      case "PRE_PAPER":
        articleCategoryContent = "Pre Paper";
        break;
      case "WHITE_PAPER":
        articleCategoryContent = "White Paper";
        break;
      case "TECH_BLOG":
        articleCategoryContent = "Tech Blog";
        break;
      default:
        articleCategoryContent = "Select Category";
    }

    return <div className={styles.categoryContent}>{articleCategoryContent}</div>;
  };

  private plusAuthorFunc = () => {
    const { dispatch } = this.props;

    dispatch(Actions.plusAuthor());
  };

  private minusAuthorFunc = (index: number) => {
    const { dispatch } = this.props;

    dispatch(Actions.minusAuthor(index));
  };

  private handleChangeArticleLink = (articleLink: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeArticleLink(articleLink));
  };

  private checkValidArticleLink = () => {
    const { dispatch } = this.props;
    const { articleLink } = this.props.articleCreateState;

    dispatch(Actions.checkValidArticleLink(articleLink));
  };

  private handleChangeArticleTitle = (articleTitle: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeArticleTitle(articleTitle));
  };

  private checkValidArticleTitle = () => {
    const { dispatch } = this.props;
    const { articleTitle } = this.props.articleCreateState;

    dispatch(Actions.checkValidArticleTitle(articleTitle));
  };

  private handleChangeAuthorName = (index: number, name: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAuthorName(index, name));
  };

  private checkValidAuthorName = (index: number) => {
    const { dispatch } = this.props;
    const name = this.props.articleCreateState.authors.getIn([index, AUTHOR_NAME_TYPE]);

    dispatch(Actions.checkValidAuthorName(index, name));
  };

  private handleChangeAuthorInstitution = (index: number, institution: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeAuthorInstitution(index, institution));
  };

  private handleChangeSummary = (summary: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSummary(summary));
  };

  private checkValidSummary = () => {
    const { dispatch } = this.props;
    const { summary } = this.props.articleCreateState;

    dispatch(Actions.checkValidSummary(summary));
  };

  private handleChangeNote = (note: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeNote(note));
  };

  private checkValidateStep = (nowStep: ARTICLE_CREATE_STEP) => {
    const { dispatch, articleCreateState } = this.props;

    dispatch(Actions.checkValidateStep(nowStep, articleCreateState));
  };

  render() {
    const {
      articleLink,
      articleCategory,
      articleTitle,
      summary,
      note,
      authors,
      currentStep,
      hasErrorCheck,
    } = this.props.articleCreateState;

    let preventMoveLocation: boolean = false;
    preventMoveLocation =
      articleLink !== initialArticleLinkInput &&
      this.props.currentUserState.isLoggedIn &&
      currentStep !== ARTICLE_CREATE_STEP.FINAL + 1;

    return (
      <div className={styles.articleCreateContainer}>
        <Prompt when={preventMoveLocation} message="Wait! If you go back now, your article will be deleted." />
        <div className={styles.articleEditorBackground} />
        <div className={styles.innerContainer}>
          <div className={styles.title}>Submit Your Article</div>
          <div className={styles.content}>
            Share OA papers, white papers, and tech blog articles about crypto currency<br /> on Pluto that you want to
            review or discuss.
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
                      onChangeFunc={this.handleChangeArticleLink}
                      onBlurFunc={this.checkValidArticleLink}
                      type="normal"
                      defaultValue={articleLink}
                      placeHolder="https://"
                      hasError={hasErrorCheck.articleLink}
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
                        hasErrorCheck.articleCategory
                          ? `${styles.hasError} ${styles.articleCategoryBtn}`
                          : styles.articleCategoryBtn
                      }
                      onClick={this.toggleArticleCategoryDropDown}
                    >
                      {this.getArticleCategoryContent(articleCategory)}
                      {this.getArrowPointIcon()}
                    </div>
                    {this.getDropDownMenuContainer()}
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Article Title
                    </div>
                    <InputBox
                      onChangeFunc={this.handleChangeArticleTitle}
                      onBlurFunc={this.checkValidArticleTitle}
                      type="normal"
                      defaultValue={articleTitle}
                      hasError={hasErrorCheck.articleTitle}
                    />
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Authors
                    </div>
                    <AuthorInput
                      authors={authors}
                      errorCheck={hasErrorCheck}
                      plusAuthorFunc={this.plusAuthorFunc}
                      minusAuthorFunc={this.minusAuthorFunc}
                      handleChangeAuthorName={this.handleChangeAuthorName}
                      checkValidAuthorName={this.checkValidAuthorName}
                      handleChangeAuthorInstitution={this.handleChangeAuthorInstitution}
                    />
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Abstract <span style={{ fontWeight: 300 }}>or Summary</span>
                    </div>
                    <InputBox
                      onChangeFunc={this.handleChangeSummary}
                      onBlurFunc={this.checkValidSummary}
                      type="textarea"
                      defaultValue={summary}
                      hasError={hasErrorCheck.summary}
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
                    <InputBox onChangeFunc={this.handleChangeNote} defaultValue={note} type="textarea" />
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
