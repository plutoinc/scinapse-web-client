import React, { FC, useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import AffiliationSelectBox from '../dialog/components/modifyProfile/affiliationSelectBox';
import { withStyles } from '../../helpers/withStylesHelper';
import classNames from 'classnames';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../icons';
import { ProfileEmailQueryParams } from '../profileVerifyEmail';
import { ProfileAffiliation } from '../../model/profileAffiliation';
import AffiliationAPI from '../../api/affiliation';
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

const ProfileVerifyEmailSentContent: FC = () => {
  return (
    <div>
      Email Sent!
    </div>
  )
}

const ProfileVerifyEmailForm: FC<ProfileVerifyEmailFormProps> = (props) => {
  const { queryParams } = props;
  const [affiliationSelected, setAffiliationSelected] = useState<boolean>(false);
  const [profileAffiliation, setProfileAffiliation] = useState<ProfileAffiliation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProfileAffiliation () {
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
      const res = await AffiliationAPI.verifyAffiliation({
        affiliation_id: affiliation.id,
        affiliation_domain_id: domainId,
        email: `${emailPrefix}@${domainName}`,
      })
      if (res) {
        setIsEmailSent(true);
      }
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
                  setFieldValue('domain', domains[0].id );
                }
                return (
                  <Form>
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
                        <div className={s.emailPrefixInputCotainer}>
                          <Field
                            name="emailPrefix"
                            placeholder="Email"
                            className={classNames({
                              [s.inputForm]: true,
                              [s.hasError]: !!errors.emailPrefix && touched.emailPrefix,
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
                          <Icon icon="ARROW_DOWN"/>
                        </div>
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
          )
      }
    </div>
  );
};

export default withStyles<typeof ProfileVerifyEmailForm>(s)(ProfileVerifyEmailForm);
