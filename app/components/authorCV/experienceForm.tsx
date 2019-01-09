import * as React from "react";
import { Formik, Form, Field, FormikErrors, ErrorMessage } from "formik";
import * as classNames from "classnames";
import { CvBaseInfo } from "../../api/profile";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import ReduxAutoSizeTextarea from "../common/autoSizeTextarea/reduxAutoSizeTextarea";
import scinapseFormikCheckbox from "../common/scinapseInput/scinapseFormikCheckbox";
import { withStyles } from "../../helpers/withStylesHelper";
import { handelAvailableSubmitFlag } from "../../containers/authorCvSection";
const styles = require("./authorCVForm.scss");

export interface ExperienceFormState extends CvBaseInfo {
  description: string | null;
  position: string;
}

interface ExperienceFormProps {
  isOpen: boolean;
  isLoading: boolean;
  initialValues: ExperienceFormState;
  handleSubmitForm: (experience: ExperienceFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

const validateForm = (values: ExperienceFormState) => {
  const errors: FormikErrors<ExperienceFormState> = {};

  if (!values.department && values.department.length < 2) {
    errors.department = "Minimum length is 1";
  }

  if (!values.position && values.position.length < 2) {
    errors.position = "Minimum length is 1";
  }

  if (!values.institution_name && values.institution_name.length < 2) {
    errors.institution_name = "Not available institution";
  }

  if (!values.start_date) {
    errors.start_date = "Please selected valid date";
  }

  if (!values.is_current && !values.end_date) {
    errors.end_date = "Please selected valid date";
  }

  if (!values.is_current && values.end_date) {
    const start_date = new Date(values.start_date);
    const end_date = new Date(values.end_date);
    start_date.getTime() - end_date.getTime() > 0 ? (errors.end_date = "Selected to future date") : "";
  }

  return errors;
};

@withStyles<typeof ExperienceForm>(styles)
class ExperienceForm extends React.PureComponent<ExperienceFormProps> {
  private formikNode: Formik<ExperienceFormState> | null;

  public componentWillReceiveProps(nextProps: ExperienceFormProps) {
    if (!this.props.isOpen && nextProps.isOpen && this.formikNode) {
      this.formikNode.resetForm();
    }
  }

  public render() {
    const { handleClose, isLoading, handleSubmitForm, initialValues } = this.props;
    const wrapperStyle: React.CSSProperties = { display: "inline-flex", position: "relative" };

    return (
      <Formik
        ref={(el: any) => (this.formikNode = el)}
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        validate={validateForm}
        enableReinitialize={true}
        render={({ values, errors, touched }) => {
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
                      className={classNames({
                        [styles.inputField]: true,
                        [styles.errorInputField]: !!errors.position && touched.position,
                      })}
                    />
                    <ErrorMessage name="position" className={styles.errorMessage} component="div" />
                  </div>

                  <div className={styles.inlineInput}>
                    <label htmlFor="institution_name">Institution</label>
                    <Field
                      name="institution_name"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      className={classNames({
                        [styles.inputField]: true,
                        [styles.errorInputField]: !!errors.institution_name && touched.institution_name,
                      })}
                    />
                    <ErrorMessage name="institution_name" className={styles.errorMessage} component="div" />
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="department">Department</label>
                    <Field
                      name="department"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      className={classNames({
                        [styles.inputField]: true,
                        [styles.errorInputField]: !!errors.department && touched.department,
                      })}
                    />
                    <ErrorMessage name="department" className={styles.errorMessage} component="div" />
                  </div>
                  <div className={styles.dateWrapper}>
                    <div className={styles.dateInlineInput}>
                      <label htmlFor="start_date">Time period</label>
                      <Field
                        name="start_date"
                        type="month"
                        className={classNames({
                          [styles.dateField]: true,
                          [styles.errorInputField]: !!errors.start_date && touched.start_date,
                        })}
                      />
                      <span className={styles.toSyntax}>to</span>
                      <ErrorMessage name="start_date" className={styles.errorMessage} component="div" />
                    </div>
                    {!values.is_current ? (
                      <div className={styles.dateInlineInput}>
                        <Field
                          name="end_date"
                          type="month"
                          className={classNames({
                            [styles.dateField]: true,
                            [styles.errorInputField]: !!errors.end_date && touched.end_date,
                          })}
                        />
                        <ErrorMessage name="end_date" className={styles.errorMessage} component="div" />
                      </div>
                    ) : (
                      <div className={styles.noDateSyntax}>
                        <span>Present</span>
                      </div>
                    )}
                    <div className={styles.dateCheckWrapper}>
                      <Field
                        className={styles.checkBox}
                        component={scinapseFormikCheckbox}
                        name="is_current"
                        type="checkbox"
                        checked={initialValues.is_current}
                      />
                      <label htmlFor="is_current">currently doing</label>
                    </div>
                  </div>
                  <div className={styles.bioWrapper}>
                    <label htmlFor="bio">
                      Description
                      <small className={styles.optionalText}>(Optional)</small>
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
                      isLoading={isLoading}
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
                        backgroundColor: handelAvailableSubmitFlag(errors, touched) ? "#48d2a0" : "#bbc2d0",
                        cursor: !handelAvailableSubmitFlag(errors, touched) ? "not-allowed" : "pointer",
                        width: "57px",
                        height: "42px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      disabled={isLoading}
                      isLoading={isLoading}
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
