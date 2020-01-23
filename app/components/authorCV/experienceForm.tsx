import * as React from 'react';
import { Formik, Form, Field, FormikErrors, ErrorMessage } from 'formik';
import * as classNames from 'classnames';
import { Button } from '@pluto_network/pluto-design-elements';
import { CvBaseInfo } from '../../api/profileInfo';
import ScinapseFormikInput from '../common/scinapseInput/scinapseFormikInput';
import ReduxAutoSizeTextarea from '../common/autoSizeTextarea/reduxAutoSizeTextarea';
import scinapseFormikCheckbox from '../common/scinapseInput/scinapseFormikCheckbox';
import { withStyles } from '../../helpers/withStylesHelper';
import AffiliationBox from './affiliationBox';
const styles = require('./authorCVForm.scss');

export interface ExperienceFormState extends CvBaseInfo {
  department: string | null;
  description: string | null;
  position: string;
  startDate: string;
  endDate: string;
}

interface ExperienceFormProps {
  wrapperStyle: React.CSSProperties;
  inputStyle: React.CSSProperties;
  isOpen: boolean;
  isLoading: boolean;
  initialValues: ExperienceFormState;
  handleSubmitForm: (experience: ExperienceFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

const validateForm = (values: ExperienceFormState) => {
  const errors: FormikErrors<ExperienceFormState> = {};
  const currentYear = new Date().getFullYear();

  if (!values.position && values.position.length < 2) {
    errors.position = 'Minimum length is 1';
  }

  if (!values.institutionName && values.institutionName.length < 2) {
    errors.institutionName = 'Not available institution';
  }

  if (!values.startDate) {
    errors.startDate = 'Please write valid year (ex. 2010)';
  }

  if (!values.isCurrent && !values.endDate) {
    errors.startDate = 'Please write valid year (ex. 2010)';
    errors.endDate = ' ';
  }

  if (!values.isCurrent && values.endDate && parseInt(values.startDate, 10) - parseInt(values.endDate, 10) > 0) {
    errors.endDate = 'Please write a future date';
    errors.startDate = ' ';
  }

  if (values.startDate && currentYear - parseInt(values.startDate, 10) < 0) {
    errors.startDate = 'Please write before current date';
    errors.endDate = ' ';
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
    const { handleClose, isLoading, handleSubmitForm, initialValues, wrapperStyle, inputStyle } = this.props;

    return (
      <Formik
        ref={(el: any) => (this.formikNode = el)}
        initialValues={initialValues}
        onSubmit={handleSubmitForm}
        validate={validateForm}
        validateOnChange={false}
        validateOnBlur={false}
        enableReinitialize={true}
        render={({ values, errors }) => {
          return (
            <Form>
              <div className={styles.contentSection}>
                <div className={styles.formControl}>
                  <div className={styles.inlineInput}>
                    <label htmlFor="degree">Position</label>
                    <div className={styles.formInputBox}>
                      <Field
                        name="position"
                        type="text"
                        component={ScinapseFormikInput}
                        inputStyle={inputStyle}
                        wrapperStyle={wrapperStyle}
                        className={classNames({
                          [styles.inputField]: true,
                          [styles.errorInputField]: !!errors.position,
                        })}
                      />
                    </div>
                  </div>

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
                    <label htmlFor="department" className={styles.optionalLabel}>
                      Department
                      <small className={styles.optionalText}>(Optional)</small>
                    </label>
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
                  <div className={styles.dateWrapper}>
                    <div className={styles.startDateInlineInput}>
                      <label htmlFor="startDate">Time period</label>
                      <div className={styles.formInputBox}>
                        <div className={styles.dateInputWrapper}>
                          <Field
                            name="startDate"
                            type="text"
                            placeholder="Year"
                            style={{ color: '#666d7c' }}
                            maxLength="4"
                            className={classNames({
                              [styles.dateYearField]: true,
                              [styles.errorInputField]: !!errors.startDate,
                            })}
                          />
                          <span className={styles.toSyntax}>to</span>
                          <ErrorMessage name="startDate" className={styles.errorMessage} component="div" />
                          <ErrorMessage name="endDate" className={styles.errorMessage} component="div" />
                        </div>
                      </div>
                    </div>
                    {!values.isCurrent ? (
                      <div className={styles.endDateInlineInput}>
                        <div className={styles.formInputBox}>
                          <div className={styles.dateInputWrapper}>
                            <Field
                              name="endDate"
                              type="text"
                              placeholder="Year"
                              style={{ color: '#666d7c' }}
                              maxLength="4"
                              className={classNames({
                                [styles.dateYearField]: true,
                                [styles.errorInputField]: !!errors.endDate,
                              })}
                            />
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
                  <div className={styles.bioWrapper}>
                    <label htmlFor="bio" className={styles.descriptLabel}>
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

export default ExperienceForm;
