import * as React from "react";
import { Formik, Form, Field, FormikErrors, ErrorMessage } from "formik";
import * as classNames from "classnames";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import scinapseFormikSelect from "../common/scinapseInput/scinapseFormikSelect";
import { getFormattingDate } from "../../containers/authorCvSection";
const styles = require("./authorCVForm.scss");

export interface AwardFormState {
  id?: string;
  title: string;
  receivedDate: string;
  receivedDateYear: string;
  receivedDateMonth: string;
}

interface AwardFormProps {
  monthItems: JSX.Element[];
  isOpen: boolean;
  isLoading: boolean;
  initialValues: AwardFormState;
  handleSubmitForm: (award: AwardFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

const validateForm = (values: AwardFormState) => {
  const errors: FormikErrors<AwardFormState> = {};

  if (!values.title && values.title.length < 2) {
    errors.title = "Minimum length is 1";
  }

  if (!values.receivedDateMonth) {
    errors.receivedDateMonth = "Please selected valid month";
  }

  if (!values.receivedDateYear) {
    errors.receivedDateMonth = "Please write valid year (ex. 2010)";
  }

  if (values.receivedDateYear && values.receivedDateMonth) {
    const currentDate = new Date().getTime();
    const receivedDateStr = getFormattingDate(values.receivedDateYear, values.receivedDateMonth);
    const receivedDate = new Date(receivedDateStr);
    currentDate - receivedDate.getTime() < 0 ? (errors.receivedDateMonth = "Please write before current date") : "";
  }

  return errors;
};

@withStyles<typeof AwardForm>(styles)
class AwardForm extends React.PureComponent<AwardFormProps> {
  private formikNode: Formik<AwardFormState> | null;

  public componentWillReceiveProps(nextProps: AwardFormProps) {
    if (!this.props.isOpen && nextProps.isOpen && this.formikNode) {
      this.formikNode.resetForm();
    }
  }

  public render() {
    const { handleClose, handleSubmitForm, initialValues, isLoading, monthItems } = this.props;
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
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={true}
        render={({ errors, values }) => {
          return (
            <Form>
              <div className={styles.contentSection}>
                <div className={styles.formControl}>
                  <div className={styles.inlineInput}>
                    <label htmlFor="title">Award title</label>
                    <div className={styles.formInputBox}>
                      <Field
                        name="title"
                        type="text"
                        component={ScinapseFormikInput}
                        inputStyle={inputStyle}
                        wrapperStyle={wrapperStyle}
                        className={classNames({
                          [styles.inputField]: true,
                          [styles.errorInputField]: !!errors.title,
                        })}
                      />
                    </div>
                  </div>
                  <div className={styles.dateWrapper}>
                    <div className={styles.startDateInlineInput}>
                      <label htmlFor="receivedDate">Date</label>
                      <div className={styles.formInputBox}>
                        <div className={styles.dateInputWrapper}>
                          <Field
                            name="receivedDateMonth"
                            component={scinapseFormikSelect}
                            placeHolderContent="Month"
                            defaultValue={values.receivedDateMonth}
                            inputStyle={inputStyle}
                            children={monthItems}
                            className={classNames({
                              [styles.dateMonthField]: true,
                              [styles.errorInputField]: !!errors.receivedDateMonth,
                            })}
                          />
                          <Field
                            name="receivedDateYear"
                            type="text"
                            placeholder="Year"
                            style={{ color: "#666d7c" }}
                            maxLength="4"
                            className={classNames({
                              [styles.dateYearField]: true,
                              [styles.errorInputField]: !!errors.receivedDateMonth,
                            })}
                          />
                          <ErrorMessage name="receivedDateMonth" className={styles.errorMessage} component="div" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.buttonsWrapper}>
                    <ScinapseButton
                      type="button"
                      onClick={handleClose}
                      isLoading={isLoading}
                      gaCategory="New Author Show"
                      gaAction="Click Cancel Button in Author CV page"
                      gaLabel="Cancel award form"
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
                      gaLabel={`Save award in awardForm`}
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

export default AwardForm;
