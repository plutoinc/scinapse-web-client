import * as React from 'react';
import { Formik, Form, Field, FormikErrors, ErrorMessage } from 'formik';
import * as classNames from 'classnames';
import { Button } from '@pluto_network/pluto-design-elements';
import { withStyles } from '../../helpers/withStylesHelper';
import ScinapseFormikInput from '../common/scinapseInput/scinapseFormikInput';
const styles = require('./authorCVForm.scss');

export interface AwardFormState {
  id?: string;
  title: string;
  receivedDate: string;
  relatedLink: string | null;
}

interface AwardFormProps {
  isOpen: boolean;
  isLoading: boolean;
  initialValues: AwardFormState;
  handleSubmitForm: (award: AwardFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

const validateForm = (values: AwardFormState) => {
  const errors: FormikErrors<AwardFormState> = {};
  const currentYear = new Date().getFullYear();

  if (!values.title && values.title.length < 2) {
    errors.title = 'Minimum length is 1';
  }

  if (!values.receivedDate) {
    errors.receivedDate = 'Please write valid year (ex. 2010)';
  }

  if (values.receivedDate && currentYear - parseInt(values.receivedDate, 10) < 0) {
    errors.receivedDate = 'Please write before current date';
  }

  if (values.relatedLink && values.relatedLink.match(/(http(s)?:\/\/.)/g) === null) {
    errors.relatedLink = 'Please write start to http:// or https://';
  }

  return errors;
};

@withStyles<typeof AwardForm>(styles)
class AwardForm extends React.PureComponent<AwardFormProps> {
  private formikNode: Formik<AwardFormState> | null;

  public componentDidUpdate(prevProps: AwardFormProps) {
    if (prevProps.isOpen && !this.props.isOpen && this.formikNode) {
      this.formikNode.resetForm();
    }
  }

  public render() {
    const { handleClose, handleSubmitForm, initialValues, isLoading } = this.props;
    const wrapperStyle: React.CSSProperties = { display: 'inline-flex', position: 'relative' };
    const inputStyle: React.CSSProperties = {
      color: '#666d7c',
      fontSize: '13px',
      lineHeight: '1.54',
      fontFamily: 'Roboto',
      padding: '8px',
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
        render={({ errors }) => {
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
                  <div className={styles.inlineInput}>
                    <label htmlFor="relatedLink" className={styles.optionalLabel}>
                      Related Link
                      <small className={styles.optionalText}>(Optional)</small>
                    </label>
                    <div className={styles.formInputBox}>
                      <Field
                        name="relatedLink"
                        type="text"
                        placeholder="http:// or https://"
                        component={ScinapseFormikInput}
                        inputStyle={inputStyle}
                        wrapperStyle={wrapperStyle}
                        className={classNames({
                          [styles.inputField]: true,
                          [styles.errorInputField]: !!errors.relatedLink,
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
                            name="receivedDate"
                            type="text"
                            placeholder="Year"
                            style={{ color: '#666d7c' }}
                            maxLength="4"
                            className={classNames({
                              [styles.dateYearField]: true,
                              [styles.errorInputField]: !!errors.receivedDate,
                            })}
                          />
                          <ErrorMessage name="receivedDate" className={styles.errorMessage} component="div" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.buttonsWrapper}>
                    <Button
                      elementType="button"
                      variant="text"
                      color="gray"
                      onClick={handleClose}
                      isLoading={isLoading}
                      style={{
                        marginRight: '8px',
                      }}
                    >
                      <span>Cancel</span>
                    </Button>
                    <Button
                      elementType="button"
                      type="submit"
                      disabled={isLoading}
                      isLoading={isLoading}
                      style={{
                        backgroundColor: '#48d2a0',
                        borderColor: '#48d2a0',
                      }}
                    >
                      <span>Save</span>
                    </Button>
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
