import React, { FC } from 'react';
import { Formik, Form, Field } from 'formik';
import { SuggestAffiliation } from '../../api/suggest';
import { Affiliation } from '../../model/affiliation';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducers';
import { CurrentUser } from '../../model/currentUser';
import AffiliationSelectBox from '../dialog/components/modifyProfile/affiliationSelectBox';


type ProfileRegisterFormValues = {
  firstName: string;
  lastName: string;
  affiliation: Affiliation | SuggestAffiliation;
}

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

const ProfileRegisterForm: FC = () => {

  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);

  const initialValues: ProfileRegisterFormValues = {
    firstName: '',
    lastName: '',
    affiliation: {
      id: null,
      name: currentUser.affiliationName || '',
      nameAbbrev: null,
    },
  };
  const handleSubmit = () => {

  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {
          ({}) => (
            <Form>
              <label>First Name</label>
              <Field
                name="firstName"
                placeholder="First Name"
              />
              <label>Last Name</label>
              <Field
                name="lastName"
                placeholder="Last Name"
              />
              <label>Affiliation</label>
              <Field
                name="affiliation"
                component={AffiliationSelectBox}
                placeholder="Last Name"
                format={formatAffiliation}
              />
              <button
                type="submit"
              >
                Create Profile
              </button>
            </Form>
          )
        }
      </Formik>
    </>
  )
}

export default ProfileRegisterForm;
