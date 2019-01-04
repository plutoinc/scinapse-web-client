import * as React from "react";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import { withStyles } from "../../helpers/withStylesHelper";
import { Formik, Form, Field } from "formik";
import ReduxAutoSizeTextarea from "../common/autoSizeTextarea/reduxAutoSizeTextarea";
import scinapseFormikCheckbox from "../common/scinapseInput/scinapseFormikCheckbox";
const styles = require("./authorCVForm.scss");

export interface ExperienceFormState {
  id?: string;
  department: string;
  description: string | null;
  start_date: string;
  end_date: string;
  position: string;
  institution_id: number | null;
  institution_name: string;
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
        render={props => {
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
                    <label htmlFor="institution_name">Institution</label>
                    <Field
                      name="institution_name"
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
                    {!props.values.is_current ? (
                      <Field name="end_date" type="month" inputClassName={styles.inputField} />
                    ) : (
                      ""
                    )}
                    <Field
                      className={styles.checkBox}
                      component={scinapseFormikCheckbox}
                      name="is_current"
                      type="checkbox"
                      checked={initialValues.is_current}
                    />
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
                      type="button"
                      onClick={handleClose}
                      gaCategory="New Author Show"
                      gaAction="Click Cancel Button in Author CV page"
                      gaLabel="Cancel experience form"
                      content="Cancel"
                      style={{
                        height: "42px",
                        fontWeight: "bold",
                        fontSize: "14px",
                        opacity: 0.25,
                        color: "#1e2a35",
                        border: "none",
                        display: "inline-block",
                        marginRight: "8px",
                      }}
                    />
                    <ScinapseButton
                      type="submit"
                      style={{
                        backgroundColor: isLoading ? "#48d2a0" : "#bbc2d0",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        width: "57px",
                        height: "42px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      disabled={isLoading}
                      gaCategory="New Author Show"
                      gaAction="Click Save Button in Author CV page "
                      gaLabel={`Save experience in experienceForm`}
                      content="Save"
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
