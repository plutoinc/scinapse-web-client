import * as React from "react";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import { withStyles } from "../../helpers/withStylesHelper";
import { Formik, Form, Field } from "formik";
const styles = require("./authorCVForm.scss");

export interface EducationFormState {
  degree: string;
  department: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  institution: string;
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
                    <label htmlFor="degree">Degree</label>
                    <Field
                      name="degree"
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
                      gaLabel={`Save award awardForm`}
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

export default EducationForm;
