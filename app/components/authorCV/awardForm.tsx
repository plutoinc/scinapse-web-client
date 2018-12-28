import * as React from "react";
import ScinapseFormikInput from "../common/scinapseInput/scinapseFormikInput";
import ScinapseButton from "../common/scinapseButton";
import { withStyles } from "../../helpers/withStylesHelper";
import { Formik, Form, Field } from "formik";
const styles = require("./authorCVForm.scss");

export interface AwardFormState {
  title: string;
  received_date: string;
}

interface AwardFormProps {
  isOpen: boolean;
  isLoading: boolean;
  initialValues: AwardFormState;
  handleSubmitForm: (award: AwardFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

@withStyles<typeof AwardForm>(styles)
class AwardForm extends React.PureComponent<AwardFormProps> {
  private formikNode: Formik<AwardFormState> | null;

  public componentWillReceiveProps(nextProps: AwardFormProps) {
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
                    <label htmlFor="title">Award title</label>
                    <Field
                      name="title"
                      type="text"
                      component={ScinapseFormikInput}
                      wrapperStyle={wrapperStyle}
                      inputClassName={styles.inputField}
                    />
                  </div>
                  <div className={styles.inlineInput}>
                    <label htmlFor="received_date">Date</label>
                    <Field name="received_date" type="month" inputClassName={styles.inputField} />
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

export default AwardForm;
