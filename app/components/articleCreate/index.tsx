import * as React from "react";
import { IArticleCreateStateRecord, ARTICLE_CREATE_STEP, ARTICLE_CATEGORY } from "./records";
import { connect, DispatchProp } from "react-redux";
import { Step, Stepper, StepContent, StepLabel } from "material-ui/Stepper";
import * as Actions from "./actions";
import { IAppState } from "../../reducers";
import Icon from "../../icons/index";
import { IAuthor } from "../../model/author";

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

  private selectArticleCategory(category: ARTICLE_CATEGORY) {
    const { dispatch } = this.props;

    dispatch(Actions.selectArticleCategory(category));
  }

  private toggleArticleCategoryDropDown() {
    const { dispatch } = this.props;

    dispatch(Actions.toggleArticleCategoryDropDown());
  }

  private getArrowPointIcon() {
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
  }

  private getDropDownMenuContainer() {
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
  }

  private getAuthorsInputContainer() {
    const { authors } = this.props.articleCreateState;

    return <div className={styles.authorsInputContainer}>{authors.map(this.mapAuthorInput)}</div>;
  }

  private addAuthor() {
    const { dispatch } = this.props;

    dispatch(Actions.addAuthor());
  }

  private mapAuthorInput(author: IAuthor, index: number) {
    return (
      <div key={author.name + index} className={styles.authorInputLine}>
        <div className={styles.authorIndex}>{index + 1}</div>
        <div className={styles.fullNameInputWrapper}>
          <input placeholder="Full Name" className={`form-control ${styles.inputBox}`} type="text" />
        </div>
        <div className={styles.institutionInputWrapper}>
          <input placeholder="Institution (Option)" className={`form-control ${styles.inputBox}`} type="text" />
        </div>
        <a
          onClick={() => {
            this.addAuthor();
          }}
          className={styles.authorButtonIconWrapper}
        >
          <Icon icon="AUTHOR_ADD_BUTTON" />
        </a>
      </div>
    );
  }

  render() {
    const { articleCategory } = this.props.articleCreateState;

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
              <Stepper activeStep={1} orientation="vertical">
                <Step>
                  <StepLabel>Please enter the original article link</StepLabel>
                  <StepContent style={stepContentStyle}>
                    <div className={styles.smallTitle}>Article Link</div>
                    <div className={styles.articleLongInputWrapper}>
                      <input placeholder="https://" className={`form-control ${styles.inputBox}`} type="url" />
                    </div>
                    {this.renderStepActions(ARTICLE_CREATE_STEP.FIRST)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Please enter the article information</StepLabel>
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
                    <div className={styles.articleLongInputWrapper}>
                      <input className={`form-control ${styles.inputBox}`} type="url" />
                    </div>
                    <div className={styles.smallTitle} style={{ marginTop: 20 }}>
                      Authors
                    </div>
                    {this.getAuthorsInputContainer()}
                    {this.renderStepActions(ARTICLE_CREATE_STEP.SECOND)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Please enter the note for evaluator (Option) </StepLabel>
                  <StepContent style={stepContentStyle}>
                    <div className={styles.articleLinkContent}>Article Link</div>
                    <div className={styles.articleLongInputWrapper}>
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
