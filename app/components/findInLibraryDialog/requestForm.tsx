import React from 'react';
import { Field, Formik, Form, FormikErrors } from 'formik';
import classNames from 'classnames';
import { Button } from '@pluto_network/pluto-design-elements';
import AffiliationSelectBox from '../dialog/components/modifyProfile/affiliationSelectBox';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import FormikInput from '../common/formikInput';
import validateEmail from '../../helpers/validateEmail';
import Icon from '../../icons';
import { CurrentUser } from '../../model/currentUser';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./findInLibraryDialog.scss');

export interface RequestFormState {
  email: string;
  affiliation: Affiliation | SuggestAffiliation | string;
}

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

function validateForm(values: RequestFormState) {
  const errors: FormikErrors<RequestFormState> = {};
  if (!validateEmail(values.email)) {
    errors.email = 'Please enter valid e-mail address.';
  }

  if (!values.affiliation) {
    errors.affiliation = 'Please enter your affiliation.';
  }
  return errors;
}

const RequestForm: React.FC<{
  isLoading: boolean;
  handleSubmit: (values: RequestFormState) => Promise<void>;
  currentUser: CurrentUser;
}> = ({ isLoading, handleSubmit, currentUser }) => {
  useStyles(s);

  return (
    <div className={s.mainContainer}>
      <div className={s.titleArea}>
        <div className={s.title}>
          Not yet linked <br />
          <span className={s.subTitle}>with Scinapse.</span>
        </div>
      </div>
      <div className={s.contentsArea}>
        <div>
          <span>Fill out the form below</span>
          <br />
          <span>and let us know about your associated library.</span>
          <br />
          <span>We will notify you via email once we’ve linked with your library.</span>
        </div>
      </div>
      <div className={s.contentDivider} />
      <div className={s.formWrapper}>
        <Formik
          initialValues={{
            email: currentUser.email || '',
            affiliation:
              ({ id: currentUser.affiliationId, name: currentUser.affiliationName, nameAbbrev: null } as Affiliation) ||
              '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
          enableReinitialize
          render={({ errors }) => {
            return (
              <Form>
                <div className={s.fieldWrapper}>
                  <Field
                    className={s.emailInput}
                    name="email"
                    placeholder="Email"
                    labelText="EMAIL"
                    component={FormikInput}
                    error={errors.email}
                    helperText="Using institutional email is more effective."
                    leadingIcon={<Icon icon="EMAIL" />}
                    type="email"
                    variant="outlined"
                  />
                  <div>
                    <label htmlFor="affiliation" className={s.label}>
                      AFFILIATION
                    </label>
                    <Field
                      name="affiliation"
                      placeholder="Affiliation / Company"
                      component={AffiliationSelectBox}
                      className={classNames({
                        [s.affiliationInput]: true,
                        [s.hasError]: !!errors.affiliation,
                      })}
                      errorWrapperClassName={s.affiliationErrorMsg}
                      format={formatAffiliation}
                    />
                  </div>
                </div>
                <Button elementType="button" fullWidth={true} type="submit" disabled={isLoading}>
                  <Icon icon="SEND" />
                  <span>SEND REQUEST</span>
                </Button>
              </Form>
            );
          }}
        />
      </div>
    </div>
  );
};

export default RequestForm;
