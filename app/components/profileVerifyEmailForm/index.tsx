import React, { FC, useState, useEffect } from 'react';
import { Formik, Form, Field, FormikErrors } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import classNames from 'classnames';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import AffiliationSelectBox from '../dialog/components/modifyProfile/affiliationSelectBox';
import Icon from '../../icons';
import { ProfileEmailQueryParams } from '../profileVerifyEmail';
import { ProfileAffiliation } from '../../model/profileAffiliation';
import AffiliationAPI from '../../api/affiliation';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profileVerifyEmailForm.scss');

type ProfileVerifyEmailFormProps = {
  queryParams: ProfileEmailQueryParams;
}

type ProfileVerifyEmailFormValues = {
  affiliation: Affiliation | SuggestAffiliation;
  emailPrefix: string;
  domain: number;
}

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

const validateForm = (values: ProfileVerifyEmailFormValues) => {
  const errors: FormikErrors<ProfileVerifyEmailFormValues> = {};
  const { emailPrefix } = values;

  if (!emailPrefix) {
    errors.emailPrefix = 'Please enter valid email';
  }

  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))$/;
  if (emailPrefix && !reg.test(emailPrefix)) {
    errors.emailPrefix = 'Please enter valid local part only';
  }

  return errors;
}

const ProfileVerifyEmailSentContent: FC = () => {
  return (
    <div>
      Email Sent!
    </div>
  )
}

const ProfileVerifyEmailForm: FC<ProfileVerifyEmailFormProps> = (props) => {
  useStyles(s);
  const { queryParams } = props;
  const [affiliationSelected, setAffiliationSelected] = useState<boolean>(false);
  const [profileAffiliation, setProfileAffiliation] = useState<ProfileAffiliation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfileAffiliation() {
      if (queryParams.aid) {
        const profileAffiliation = await AffiliationAPI.getAffiliation(queryParams.aid);
        if (profileAffiliation) {
          setProfileAffiliation(profileAffiliation);
        }
        setIsLoading(false);
      }
    }
    fetchProfileAffiliation();
  }, [queryParams.aid]);

  const initialValues: ProfileVerifyEmailFormValues = {
    affiliation: {
      id: null,
      name: '',
      nameAbbrev: null,
    },
    emailPrefix: '',
    domain: -1,
  }

  const handleSubmit = async (values: ProfileVerifyEmailFormValues) => {
    const { affiliation: inputAffiliation, emailPrefix, domain: domainId } = values;
    const affiliation = inputAffiliation as Affiliation;
    setIsLoading(true);
    const domainName = profileAffiliation?.domains.filter(domain => (domain.id === Number(domainId)))[0].domain;
    if (affiliation.id && domainId && domainName) {
      AffiliationAPI.verifyAffiliation({
        affiliation_id: affiliation.id,
        affiliation_domain_id: domainId,
        email: `${emailPrefix}@${domainName}`,
      }).then(res => {
        if (res) {
          setIsEmailSent(true);
        }
      }).catch(() => {
        setInvalidEmailMessage('This email has already been verified.');
      })
    }
    setIsLoading(false);
  }

  return (
    <div>
      {
        isEmailSent
          ? <ProfileVerifyEmailSentContent />
          : (
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validate={validateForm}
              validateOnBlur
              validateOnChange
            >
              {({ values, errors, touched, submitForm, setFieldValue }) => {
                if (profileAffiliation?.domains && profileAffiliation.domains.length > 0 && (values.affiliation as Affiliation).id !== profileAffiliation.id) {
                  const { id, name, nameAbbrev, domains } = profileAffiliation;
                  setAffiliationSelected(true);
                  setFieldValue('affiliation', {
                    id,
                    name,
                    nameAbbrev,
                  })
                  setFieldValue('domain', domains[0].id);
                }
                return (
                  <Form>
                    <div className={s.description}>
            In order to create your profile, we need to verify through your email address affiliated to your
            school/organization.<br />
            Once you click “send”, you will receive a verification email to your email address to proceed.<br />
            (In the case we reached out to you first, your affiliation and email domain address should already be filled
            in).
          </div>
                    <div className={s.formRow}>
                      <div className={s.formWrapper}>
                        <label className={s.formLabel}>Affiliation</label>
                        <Field
                          name="affiliation"
                          component={AffiliationSelectBox}
                          format={formatAffiliation}
                          className={classNames({
                            [s.inputForm]: true,
                            [s.hasError]: !!errors.affiliation && !!touched.affiliation,
                          })}
                          errorWrapperClassName={s.affiliationErrorMsg}
                          disabled={isLoading || profileAffiliation}
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
                        <div className={s.emailPrefixInputContainer}>
                          <Field
                            name="emailPrefix"
                            placeholder="Email"
                            className={classNames({
                              [s.inputForm]: true,
                              [s.hasError]: (!!errors.emailPrefix || !!invalidEmailMessage) && !!touched.emailPrefix,
                            })}
                            disabled={!affiliationSelected || isLoading}
                          />
                          <Field
                            component="select"
                            name="domain"
                            className={s.selectForm}
                          >
                            {
                              profileAffiliation?.domains.map(domain => (
                                domain.id &&
                                <option key={domain.id} value={domain.id}>
                                  @{domain.domain}
                                </option>
                              ))
                            }
                          </Field>
                          <Icon icon="ARROW_DOWN" />
                        </div>
                        {touched.emailPrefix && errors.emailPrefix && <span className={s.errorMsg}>{errors.emailPrefix}</span>}
                        {touched.emailPrefix && invalidEmailMessage && <span className={s.errorMsg}>{invalidEmailMessage}</span>}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      elementType="button"
                      size="large"
                      onClick={submitForm}
                      isLoading={isLoading}
                      style={{ marginTop: '32px' }}
                      fullWidth
                    >
                      <Icon icon="SEND" />
                      <span>Send verification email</span>
                    </Button>
                  </Form>
                )
              }}
            </Formik>
          )
      }
    </div>
  );
};

export default ProfileVerifyEmailForm;
