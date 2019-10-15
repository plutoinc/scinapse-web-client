import React from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import AffiliationSelectBox from '../../components/dialog/components/modifyProfile/affiliationSelectBox';
import { AppState } from '../../reducers';
import { updateUserProfile } from '../../actions/auth';
import { ACTION_TYPES } from '../../actions/actionTypes';
import { CurrentUser } from '../../model/currentUser';
import Button from '../../components/common/button';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./profileForm.scss');

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  affiliation: Affiliation | SuggestAffiliation;
  profileLink: string;
}

type ProfileFormErrors = { [K in keyof ProfileFormValues]: string };

function isSuggestedAffiliation(affiliation: Affiliation | SuggestAffiliation): affiliation is SuggestAffiliation {
  return !!(affiliation as SuggestAffiliation).keyword;
}

const validateForm = (values: ProfileFormValues) => {
  const errors: Partial<ProfileFormErrors> = {};

  if (!values.firstName) {
    errors.firstName = 'Please enter your first name';
  }

  if (!values.lastName) {
    errors.lastName = 'Please enter your last name';
  }

  if (
    !values.affiliation ||
    (!(values.affiliation as Affiliation).name && !(values.affiliation as SuggestAffiliation).keyword)
  ) {
    errors.affiliation = 'Please enter your affiliation';
  }

  if (values.profileLink && values.profileLink.match(/(http(s)?:\/\/.)/g) === null) {
    errors.profileLink = 'Please write start to http:// or https://';
  }

  return errors;
};

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

const ErrorMessage: React.FC<{ errorMsg?: string }> = ({ errorMsg }) => {
  if (!errorMsg) return null;

  return <div className={s.errorMsg}>{errorMsg}</div>;
};

const ProfileFormContainer: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const currentUser = useSelector<AppState, CurrentUser>(state => state.currentUser);

  const [isLoading, setIsLoading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  if (!currentUser.isLoggedIn) return null;

  async function handleSubmit(values: ProfileFormValues) {
    let affiliation = values.affiliation;
    if (isSuggestedAffiliation(affiliation)) {
      affiliation = { id: affiliation.affiliationId, name: affiliation.keyword, nameAbbrev: '' };
    }

    try {
      setIsLoading(true);
      await dispatch(
        updateUserProfile({
          firstName: values.firstName,
          lastName: values.lastName,
          affiliation: affiliation,
          profileLink: values.profileLink,
        })
      );
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'success',
          message: 'Successfully changed your profile.',
        },
      });
      setIsLoading(false);
      setEditMode(false);
    } catch (err) {
      setIsLoading(false);
      dispatch({
        type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
        payload: {
          type: 'error',
          message: 'Sorry. we had an error to update your profile.',
        },
      });
    }
  }

  return (
    <div>
      <div className={s.divider} />
      <h1 className={s.title}>Profile</h1>
      <Formik
        initialValues={{
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          affiliation: {
            id: null,
            name: currentUser.affiliation,
            nameAbbrev: null,
          },
          profileLink: currentUser.profileLink,
        }}
        validate={validateForm}
        onSubmit={handleSubmit}
        validateOnChange={false}
        render={({ errors, touched }) => {
          let formButton = (
            <Button elementType="button" variant="outlined" color="gray" onClick={() => setEditMode(true)}>
              <span>Edit Profile</span>
            </Button>
          );
          if (editMode) {
            formButton = (
              <>
                <Button elementType="button" isLoading={isLoading} type="submit">
                  <span>Save changes</span>
                </Button>
                <Button
                  elementType="button"
                  variant="outlined"
                  color="gray"
                  onClick={() => setEditMode(false)}
                  style={{ marginLeft: '8px' }}
                >
                  <span>Cancel</span>
                </Button>
              </>
            );
          }

          return (
            <Form>
              <div className={s.formRow}>
                <div className={s.formWrapper}>
                  <label className={s.formLabel}>FIRST NAME</label>
                  <Field
                    className={classNames({
                      [s.inputForm]: true,
                      [s.hasError]: !!errors.firstName && touched.firstName,
                    })}
                    name="firstName"
                    placeholder="First Name"
                    disabled={!editMode}
                  />
                  <ErrorMessage errorMsg={errors.firstName} />
                </div>
                <div className={s.formWrapper}>
                  <label className={s.formLabel}>LAST NAME</label>
                  <Field
                    className={classNames({
                      [s.inputForm]: true,
                      [s.hasError]: !!errors.lastName && touched.lastName,
                    })}
                    name="lastName"
                    placeholder="Last Name"
                    disabled={!editMode}
                  />
                  <ErrorMessage errorMsg={errors.lastName} />
                </div>
              </div>
              <div className={s.affiliationFormWrapper}>
                <label className={s.formLabel}>AFFILIATION / COMPANY</label>
                <Field
                  name="affiliation"
                  component={AffiliationSelectBox}
                  placeholder="Affiliation / Company"
                  className={classNames({
                    [s.inputForm]: true,
                    [s.hasError]: !!errors.affiliation && !!touched.affiliation,
                  })}
                  errorWrapperClassName={s.affiliationErrorMsg}
                  disabled={!editMode}
                  format={formatAffiliation}
                />
              </div>
              <div style={{ marginBottom: 36 }} className={s.formWrapper}>
                <label className={s.formLabel}>Profile Link</label>
                <Field
                  className={classNames({
                    [s.inputForm]: true,
                    [s.hasError]: !!errors.profileLink && touched.profileLink,
                  })}
                  name="profileLink"
                  placeholder="Profile Link"
                  disabled={!editMode}
                />
                <ErrorMessage errorMsg={errors.profileLink} />
              </div>
              {formButton}
            </Form>
          );
        }}
      />
      <div className={s.divider} />
    </div>
  );
};

export default ProfileFormContainer;
