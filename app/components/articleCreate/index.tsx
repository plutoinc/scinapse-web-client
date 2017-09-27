import * as React from "react";
import { IArticleCreateStateRecord } from "./records";
import { connect, DispatchProp } from "react-redux";
import { Step, Stepper, StepContent, StepLabel } from "material-ui/Stepper";
import RaisedButton from "material-ui/RaisedButton";
import FlatButton from "material-ui/FlatButton";
import * as Actions from "./actions";
import { IAppState } from "../../reducers/index";

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

  private renderStepActions(step: number) {
    const { articleCreateState } = this.props;
    const { currentStep } = articleCreateState;

    return (
      <div style={{ margin: "12px 0" }}>
        <RaisedButton
          label={currentStep === 2 ? "Finish" : "Next"}
          disableTouchRipple={true}
          disableFocusRipple={true}
          primary={true}
          onClick={this.handleNext}
          style={{ marginRight: 12 }}
        />
        {step > 0 && (
          <FlatButton
            label="Back"
            disabled={currentStep === 0}
            disableTouchRipple={true}
            disableFocusRipple={true}
            onClick={this.handlePrev}
          />
        )}
      </div>
    );
  }

  render() {
    const { articleCreateState } = this.props;
    const canSubmit = false;

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
                  <StepContent>
                    <p>
                      For each ad campaign that you create, you can control how much you're willing to spend on clicks
                      and conversions, which networks and geographical locations you want your ads to show on, and more.
                    </p>
                    {this.renderStepActions(0)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Please enter the article information</StepLabel>
                  <StepContent>
                    <p>An ad group contains one or more ads which target a shared set of keywords.</p>
                    {this.renderStepActions(1)}
                  </StepContent>
                </Step>
                <Step>
                  <StepLabel>Please enter the note for evaluator (Option) </StepLabel>
                  <StepContent>
                    <p>
                      Try out different ad text to see what brings in the most customers, and learn how to enhance your
                      ads using features like ad extensions. If you run into any problems with your ads, find out how to
                      tell if they're running and how to resolve approval issues.
                    </p>
                    {this.renderStepActions(2)}
                  </StepContent>
                </Step>
              </Stepper>
              {canSubmit && (
                <p style={{ margin: "20px 0", textAlign: "center" }}>
                  <a
                    href="#"
                    onClick={event => {
                      event.preventDefault();
                      this.setState({ currentStep: 0, finished: false });
                    }}
                  >
                    Click here
                  </a>{" "}
                  to reset the example.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps)(ArticleCreate);
