import * as React from "react";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import { withStyles } from "../../helpers/withStylesHelper";
import { Formik, Form, Field } from "formik";
import scinapseFormikCheckbox from "../common/scinapseInput/scinapseFormikCheckbox";
const styles = require("./authorCVForm.scss");

export interface EducationFormState {
  id?: string;
  degree: string;
  department: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  institution_id: number | null;
  institution_name: string;
}

interface EducationFormProps {
  isOpen: boolean;
  isLoading: boolean;
  initialValues: EducationFormState;
  handleSubmitForm: (education: EducationFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

@withStyles<typeof EducationForm>(styles)
class EducationForm extends React.PureComponent<EducationFormProps> {
  private formikNode: Formik<EducationFormState> | null;

  public componentWillReceiveProps(nextProps: EducationFormProps) {
    if (!this.props.isOpen && nextProps.isOpen && this.formikNode) {
      this.formikNode.resetForm();
    }
  }

  public render() {
    const { handleClose, isLoading, handleSubmitForm, initialValues } = this.props;
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
                    <label htmlFor="institution_name">Institution</label>
                    <Field
                      name="institution_name"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="department">Department</label>
                    <Field
                      name="department"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="degree">Degree</label>
                    <Field
                      name="degree"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      className={styles.inputField}
                    />
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="start_date">Time period</label>
                    <Field name="start_date" type="month" className={styles.inputField} />
                    {!props.values.is_current ? (
                      <Field name="end_date" type="month" className={styles.inputField} />
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

                  <div className={styles.buttonsWrapper}>
                    <ScinapseButton
                      type="button"
                      onClick={handleClose}
                      gaCategory="New Author Show"
                      gaAction="Click Cancel Button in Author CV page"
                      gaLabel="Cancel education form"
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
