import * as React from "react";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import { withStyles } from "../../helpers/withStylesHelper";
import { Formik, Form, Field } from "formik";
import ReduxAutoSizeTextarea from "../common/autoSizeTextarea/reduxAutoSizeTextarea";
const styles = require("./authorCVForm.scss");

export interface ExperienceFormState {
  department: string;
  description: string | null;
  start_date: string;
  end_date: string;
  position: string;
  institution: string;
  is_current: boolean;
}

interface ExperienceFormProps {
  isOpen: boolean;
  isLoading: boolean;
  initialValues: ExperienceFormState;
  handleSubmitForm: (experience: ExperienceFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

@withStyles<typeof ExperienceForm>(styles)
class ExperienceForm extends React.PureComponent<ExperienceFormProps> {
  private formikNode: Formik<ExperienceFormState> | null;

  public componentWillReceiveProps(nextProps: ExperienceFormProps) {
    if (!this.props.isOpen && nextProps.isOpen && this.formikNode) {
      this.formikNode.resetForm();
    }
  }

  public render() {
    const { isOpen, handleClose, isLoading, handleSubmitForm, initialValues } = this.props;
    const wrapperStyle: React.CSSProperties = { display: "inline-flex" };

    return (
      <Formik
        ref={(el: any) => (this.formikNode = el)}
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        enableReinitialize={true}
        render={() => {
          return (
            <Form>
              <div className={styles.contentSection}>
                <div className={styles.formControl}>
                  <div className={styles.inlineInput}>
                    <label htmlFor="degree">Position</label>
                    <Field
                      name="position"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      inputClassName={styles.inputField}
                    />
                  </div>

                  <div className={styles.inlineInput}>
                    <label htmlFor="institution">Institution</label>
                    <Field
                      name="institution"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      inputClassName={styles.inputField}
                    />
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="department">Department</label>
                    <Field
                      name="department"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      inputClassName={styles.inputField}
                    />
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="start_date">Time period</label>
                    <Field name="start_date" type="month" inputClassName={styles.inputField} />
                    <Field name="end_date" type="month" inputClassName={styles.inputField} />
                    <Field name="is_current" type="checkbox" inputClassName={styles.inputField} />
                  </div>

                  <div className={styles.bioWrapper}>
                    <label htmlFor="bio">
                      Description
                      <small>
                        <p>(Optional)</p>
                      </small>
                    </label>
                    <Field
                      name="description"
                      component={ReduxAutoSizeTextarea}
                      disabled={isLoading}
                      wrapperStyle={wrapperStyle}
                      textareaClassName={styles.textAreaWrapper}
                      textareaStyle={{ padding: "8px" }}
                    />
                  </div>

                  <div className={styles.buttonsWrapper}>
                    <ScinapseButton
                      type="submit"
                      style={{
                        backgroundColor: isLoading ? "#ecf1fa" : "#6096ff",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        width: "127px",
                        height: "40px",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                      disabled={isLoading}
                      gaCategory="New Author Show"
                      gaAction="Click Save Button in Author CV page "
                      gaLabel={`Save experience ExperienceForm`}
                      content="Save Changes"
                    />
                  </div>
                </div>
              </div>
            </Form>
          );
        }}
      />
    );
  }
}

export default ExperienceForm;
