import * as React from "react";
import { Formik, Form, Field, FormikErrors, ErrorMessage } from "formik";
import * as classNames from "classnames";
import { CvBaseInfo } from "../../api/profile";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import scinapseFormikCheckbox from "../common/scinapseInput/scinapseFormikCheckbox";
import scinapseFormikSelect from "../common/scinapseInput/scinapseFormikSelect";
import { getFormattingDate } from "../../containers/authorCvSection";
import AffiliationBox from "./affiliationBox";
const styles = require("./authorCVForm.scss");

export interface EducationFormState extends CvBaseInfo {
  degree: string;
  startDateMonth: string;
  startDateYear: string;
  endDateMonth: string;
  endDateYear: string;
}

interface EducationFormProps {
  wrapperStyle: React.CSSProperties;
  inputStyle: React.CSSProperties;
  monthItems: JSX.Element[];
  isOpen: boolean;
  isLoading: boolean;
  initialValues: EducationFormState;
  handleSubmitForm: (education: EducationFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

const validateForm = (values: EducationFormState) => {
  const errors: FormikErrors<EducationFormState> = {};

  if (!values.department && values.department.length < 2) {
    errors.department = "Minimum length is 1";
  }

  if (!values.degree && values.degree.length < 2) {
    errors.degree = "Minimum length is 1";
  }

  if (!values.institutionName && values.institutionName.length < 2) {
    errors.institutionName = "Not available institution";
  }

  if (!values.startDateMonth) {
    errors.startDateMonth = "Please selected valid month";
  }

  if (!values.startDateYear) {
    errors.startDateMonth = "Please write valid year (ex. 2010)";
  }

  if (!values.isCurrent && !values.endDateMonth) {
    errors.endDateMonth = "Please selected valid month";
  }

  if (!values.isCurrent && !values.endDateYear) {
    errors.endDateMonth = "Please write valid year (ex. 2010)";
  }

  if (!values.isCurrent && values.endDateMonth && values.endDateYear) {
    const startDateStr = getFormattingDate(values.startDateYear, values.startDateMonth);
    const startDate = new Date(startDateStr);

    const endDateStr = getFormattingDate(values.endDateYear, values.endDateMonth);
    const endDate = new Date(endDateStr);
    startDate.getTime() - endDate.getTime() > 0 ? (errors.endDateMonth = "Select a future date") : "";
  }

  if (values.startDateYear && values.startDateMonth) {
    const currentDate = new Date().getTime();
    const startDateStr = getFormattingDate(values.startDateYear, values.startDateMonth);
    const startDate = new Date(startDateStr);
    currentDate - startDate.getTime() < 0 ? (errors.startDateMonth = "Please write before current date") : "";
  }

  return errors;
};

@withStyles<typeof EducationForm>(styles)
class EducationForm extends React.PureComponent<EducationFormProps> {
  private formikNode: Formik<EducationFormState> | null;

  public componentWillReceiveProps(nextProps: EducationFormProps) {
    if (!this.props.isOpen && nextProps.isOpen && this.formikNode) {
      this.formikNode.resetForm();
    }
  }

  public render() {
    const {
      handleClose,
      isLoading,
      handleSubmitForm,
      initialValues,
      monthItems,
      wrapperStyle,
      inputStyle,
    } = this.props;

    return (
      <Formik
        ref={(el: any) => (this.formikNode = el)}
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        validate={validateForm}
        enableReinitialize={true}
        validateOnChange={false}
        validateOnBlur={false}
        render={({ values, errors }) => {
          return (
            <Form>
              <div className={styles.contentSection}>
                <div className={styles.formControl}>
                  <div className={styles.inlineInput}>
                    <label htmlFor="institutionName">Institution</label>
                    <Field
                      name="institutionName"
                      type="text"
                      component={AffiliationBox}
                      inputStyle={inputStyle}
                      className={classNames({
                        [styles.inputField]: true,
                        [styles.errorInputField]: !!errors.institutionName,
                      })}
                    />
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="department">Department</label>
                    <div className={styles.formInputBox}>
                      <Field
                        name="department"
                        type="text"
                        component={ScinapseFormikInput}
                        inputStyle={inputStyle}
                        wrapperStyle={wrapperStyle}
                        className={classNames({
                          [styles.inputField]: true,
                          [styles.errorInputField]: !!errors.department,
                        })}
                      />
                    </div>
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="degree">Degree</label>
                    <div className={styles.formInputBox}>
                      <Field
                        name="degree"
                        type="text"
                        component={ScinapseFormikInput}
                        inputStyle={inputStyle}
                        wrapperStyle={wrapperStyle}
                        className={classNames({
                          [styles.inputField]: true,
                          [styles.errorInputField]: !!errors.degree,
                        })}
                      />
                    </div>
                  </div>
                  <div className={styles.dateWrapper}>
                    <div className={styles.startDateInlineInput}>
                      <label htmlFor="startDate">Time period</label>
                      <div className={styles.formInputBox}>
                        <div className={styles.dateInputWrapper}>
                          <Field
                            name="startDateMonth"
                            component={scinapseFormikSelect}
                            placeHolderContent="Month"
                            defaultValue={values.startDateMonth}
                            inputStyle={inputStyle}
                            children={monthItems}
                            className={classNames({
                              [styles.dateMonthField]: true,
                              [styles.errorInputField]: !!errors.startDateMonth,
                            })}
                          />
                          <Field
                            name="startDateYear"
                            type="text"
                            placeholder="Year"
                            style={{ color: "#666d7c" }}
                            maxLength="4"
                            className={classNames({
                              [styles.dateYearField]: true,
                              [styles.errorInputField]: !!errors.startDateMonth,
                            })}
                          />
                          <span className={styles.toSyntax}>to</span>
                          <ErrorMessage name="startDateMonth" className={styles.errorMessage} component="div" />
                        </div>
                      </div>
                    </div>
                    {!values.isCurrent ? (
                      <div className={styles.endDateInlineInput}>
                        <div className={styles.formInputBox}>
                          <div className={styles.dateInputWrapper}>
                            <Field
                              name="endDateMonth"
                              component={scinapseFormikSelect}
                              placeHolderContent="Month"
                              defaultValue={values.endDateMonth}
                              inputStyle={inputStyle}
                              children={monthItems}
                              className={classNames({
                                [styles.dateMonthField]: true,
                                [styles.errorInputField]: !!errors.endDateMonth,
                              })}
                            />
                            <Field
                              name="endDateYear"
                              type="text"
                              placeholder="Year"
                              style={{ color: "#666d7c" }}
                              maxLength="4"
                              className={classNames({
                                [styles.dateYearField]: true,
                                [styles.errorInputField]: !!errors.endDateMonth,
                              })}
                            />
                            <ErrorMessage name="endDateMonth" className={styles.errorMessage} component="div" />
                          </div>
                        </div>
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
                        name="isCurrent"
                        type="checkbox"
                        checked={initialValues.isCurrent}
                      />
                      <label htmlFor="isCurrent">Currently Doing</label>
                    </div>
                  </div>

                  <div className={styles.buttonsWrapper}>
                    <ScinapseButton
                      type="button"
                      onClick={handleClose}
                      isLoading={isLoading}
                      gaCategory="New Author Show"
                      gaAction="Click Cancel Button in Author CV page"
                      gaLabel="Cancel education form"
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
                        backgroundColor: "#48d2a0",
                        cursor: "pointer",
                        width: "57px",
                        height: "42px",
                        fontWeight: 500,
                        fontSize: "14px",
                      }}
                      disabled={isLoading}
                      isLoading={isLoading}
                      gaCategory="New Author Show"
                      gaAction="Click Save Button in Author CV page "
                      gaLabel={`Save education in educationForm`}
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

export default EducationForm;
