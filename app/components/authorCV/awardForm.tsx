import * as React from "react";
import { Formik, Form, Field, FormikErrors, ErrorMessage } from "formik";
import * as classNames from "classnames";
import { withStyles } from "../../helpers/withStylesHelper";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import { handelAvailableSubmitFlag } from "../../containers/authorCvSection";
const styles = require("./authorCVForm.scss");

export interface AwardFormState {
  id?: string;
  title: string;
  received_date: string;
  received_date_year: string;
  received_date_month: string;
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

  if (!values.received_date_month) {
    errors.received_date_year = "Please selected valid month";
  }

  if (!values.received_date_year) {
    errors.received_date_year = "Please write valid year";
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
    const wrapperStyle: React.CSSProperties = { display: "inline-flex" };

    return (
      <Formik
        ref={(el: any) => (this.formikNode = el)}
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        validate={validateForm}
        enableReinitialize={true}
        render={({ errors, touched }) => {
          return (
            <Form>
              <div className={styles.contentSection}>
                <div className={styles.formControl}>
                  <div className={styles.inlineInput}>
                    <label htmlFor="title">Award title</label>
                    <Field
                      name="title"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      className={classNames({
                        [styles.inputField]: true,
                        [styles.errorInputField]: !!errors.title && touched.title,
                      })}
                    />
                    <ErrorMessage name="title" className={styles.errorMessage} component="div" />
                  </div>
                  <div className={styles.dateWrapper}>
                    <div className={styles.dateInlineInput}>
                      <label htmlFor="received_date">Date</label>
                      <Field
                        name="received_date_month"
                        type="select"
                        component="select"
                        className={classNames({
                          [styles.dateField]: true,
                          [styles.errorInputField]: !!errors.received_date_year,
                        })}
                      >
                        <option value="" selected disabled hidden>
                          Month
                        </option>
                        {monthItems}
                      </Field>
                      <Field
                        name="received_date_year"
                        type="text"
                        placeholder="year"
                        className={classNames({
                          [styles.dateField]: true,
                          [styles.errorInputField]: !!errors.received_date_year,
                        })}
                      />
                      <ErrorMessage name="received_date_year" className={styles.errorMessage} component="div" />
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
