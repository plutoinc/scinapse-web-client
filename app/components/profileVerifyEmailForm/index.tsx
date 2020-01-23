import React, { FC, useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import AffiliationSelectBox from '../dialog/components/modifyProfile/affiliationSelectBox';
import { withStyles } from '../../helpers/withStylesHelper';
import classNames from 'classnames';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../icons';
import { useHistory } from 'react-router-dom';
const s = require('./profileVerifyEmailForm.scss');

type ProfileVerifyEmailFormProps = {
  aid?: string;
}

type ProfileVerifyEmailFormValues = {
  affiliation: Affiliation | SuggestAffiliation;
  email: string;
}

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

function getDomainPostfixByAffiliation(affiliation: Affiliation | SuggestAffiliation) {
  // test case: POSTECH for available affiliation
  if ((affiliation as SuggestAffiliation).affiliationId === '123900574') {
    return 'postech.ac.kr';
  }
  return '';
}

const ProfileVerifyEmailForm: FC<ProfileVerifyEmailFormProps> = (props) => {
  const { aid } = props;
  const [affiliationSelected, setAffiliationSelected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    // search affiliation with aid;
    console.log(aid);
  }, [aid])

  const initialValues: ProfileVerifyEmailFormValues = {
    affiliation: {
      id: null,
      name: '',
      nameAbbrev: null,
    },
    email: '',
  }

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      history.push('/profile/new');
    }, 1000);
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, submitForm }) => { 
          if (!affiliationSelected && (values.affiliation as SuggestAffiliation).affiliationId) {
            setAffiliationSelected(true);
          } else if (affiliationSelected && !(values.affiliation as SuggestAffiliation).affiliationId) {
            setAffiliationSelected(false);
          }
          return (
            <Form>
              <div className={s.formRow}>
                <div className={s.formWrapper}>
                  <label className={s.formLabel}>Affiliation</label>
                  <Field
                    name="affiliation"
                    component={AffiliationSelectBox}
                    placeholder="Affiliation"
                    format={formatAffiliation}
                    className={classNames({
                      [s.inputForm]: true,
                      [s.hasError]: !!errors.affiliation && !!touched.affiliation,
                    })}
                    errorWrapperClassName={s.affiliationErrorMsg}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div
                className={classNames({
                  [s.formRow]: true,
                  [s.dynamicFormRow]: true,
                  [s.hide]: !affiliationSelected,
                })}
              >
                <div className={s.formWrapper}>
                  <label className={s.formLabel}>Email</label>
                  <Field
                    name="emailPrefix"
                    placeholder="Email"
                    className={classNames({
                      [s.inputForm]: true,
                      [s.hasError]: !!errors.email && touched.email,
                    })}
                    disabled={!affiliationSelected || isLoading}
                  />
                </div>
                <div className={s.formWrapper}>
                  <span className={s.emailDomainPostfixLabel}>
                    {
                      (values.affiliation as SuggestAffiliation).affiliationId
                        && `@ ${getDomainPostfixByAffiliation(values.affiliation)}`
                    }
                  </span>
                </div>
              </div>
              <Button
                elementType="button"
                variant="contained"
                color="blue"
                onClick={submitForm}
                isLoading={isLoading}
              >
                <Icon icon="SEND" />
                <span>Send email</span>
              </Button>
            </Form>
          )
        }}
      </Formik>
    </div>
  );
};

export default withStyles<typeof ProfileVerifyEmailForm>(s)(ProfileVerifyEmailForm);
