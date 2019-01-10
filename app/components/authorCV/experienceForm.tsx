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
import { getFormatingDate } from "../../containers/authorCvSection/index";
import scinapseFormikSelect from "../common/scinapseInput/scinapseFormikSelect";
const styles = require("./authorCVForm.scss");

export interface ExperienceFormState extends CvBaseInfo {
  description: string | null;
  position: string;
  start_date_month: string;
  start_date_year: string;
  end_date_month: string;
  end_date_year: string;
}

interface ExperienceFormProps {
  monthItems: JSX.Element[];
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

  if (!values.start_date_month) {
    errors.start_date_year = "Please selected valid month";
  }

  if (!values.start_date_year) {
    errors.start_date_year = "Please write valid year (ex. 2010)";
  }

  if (!values.is_current && !values.end_date_month) {
    errors.end_date_year = "Please selected valid month";
  }

  if (!values.is_current && !values.end_date_year) {
    errors.end_date_year = "Please write valid year (ex. 2010)";
  }

  if (!values.is_current && values.end_date_month && values.end_date_year) {
    const start_date_str = getFormatingDate(values.start_date_year, values.start_date_month);
    const start_date = new Date(start_date_str);

    const end_date_str = getFormatingDate(values.end_date_year, values.end_date_month);
    const end_date = new Date(end_date_str);
    start_date.getTime() - end_date.getTime() > 0 ? (errors.end_date_year = "Select a future date") : "";
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
    const { handleClose, isLoading, handleSubmitForm, initialValues, monthItems } = this.props;
    const wrapperStyle: React.CSSProperties = { display: "inline-flex", position: "relative" };
    const inputStyle: React.CSSProperties = {
      color: "#666d7c",
      fontSize: "13px",
      lineHeight: "1.54",
      fontFamily: "Roboto",
      padding: "8px",
    };

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
                      inputStyle={inputStyle}
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
                      inputStyle={inputStyle}
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
                      inputStyle={inputStyle}
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
                        name="start_date_month"
                        component={scinapseFormikSelect}
                        placeHolderContent="Month"
                        defaultValue={values.start_date_month}
                        children={monthItems}
                        className={classNames({
                          [styles.dateField]: true,
                          [styles.errorInputField]: !!errors.start_date_year,
                        })}
                      />
                      <Field
                        name="start_date_year"
                        type="text"
                        placeholder="Year"
                        className={classNames({
                          [styles.dateField]: true,
                          [styles.errorInputField]: !!errors.start_date_year,
                        })}
                      />
                      <span className={styles.toSyntax}>to</span>
                      <ErrorMessage name="start_date_year" className={styles.errorMessage} component="div" />
                    </div>
                    {!values.is_current ? (
                      <div className={styles.dateInlineInput}>
                        <Field
                          name="end_date_month"
                          component={scinapseFormikSelect}
                          placeHolderContent="Month"
                          defaultValue={values.end_date_month}
                          children={monthItems}
                          className={classNames({
                            [styles.dateField]: true,
                            [styles.errorInputField]: !!errors.end_date_year,
                          })}
                        />
                        <Field
                          name="end_date_year"
                          type="text"
                          placeholder="Year"
                          className={classNames({
                            [styles.dateField]: true,
                            [styles.errorInputField]: !!errors.end_date_year,
                          })}
                        />

                        <ErrorMessage name="end_date_year" className={styles.errorMessage} component="div" />
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
                      <label htmlFor="is_current">Currently Doing</label>
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
                      textareaStyle={inputStyle}
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
                        fontWeight: 500,
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
                        fontWeight: 500,
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
