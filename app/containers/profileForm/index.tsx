import React from 'react';
import classNames from 'classnames';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import AffiliationSelectBox from '../../components/dialog/components/modifyProfile/affiliationSelectBox';
import { withStyles } from '../../helpers/withStylesHelper';
import { AppState } from '../../reducers';

const s = require('./profileForm.scss');

const validateEmptyField = (value: string) => {
  let errorMessage;
  if (!value) {
    errorMessage = 'Please fill this field';
  }
  return errorMessage;
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

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  affiliation: Affiliation;
}

interface ProfileFormProps {
  firstName: string;
  lastName: string;
  affiliation: string;
}
const ProfileForm: React.FC<ProfileFormProps> = React.memo(props => {
  // const [isLoading, setIsLoading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

  function handleSubmit(values: ProfileFormValues) {
    console.log(values);
  }

  return (
    <Formik
      initialValues={{
        firstName: props.firstName,
        lastName: props.lastName,
        affiliation: {
          id: null,
          name: props.affiliation,
          nameAbbrev: null,
        },
      }}
      onSubmit={handleSubmit}
      validateOnChange={false}
      render={({ errors, touched }) => {
        let formButton = (
          <button
            type="button"
            className={s.editButton}
            onClick={() => {
              setEditMode(true);
            }}
          >
            Edit Profile
          </button>
        );
        if (editMode) {
          formButton = (
            <button type="submit" className={s.submitButton}>
              Save changes
            </button>
          );
        }

        console.log(errors);

        return (
          <Form>
            <div className={s.formRow}>
              <div className={s.formWrapper}>
                <label className={s.formLabel}>FIRST NAME</label>
                <Field
                  validate={validateEmptyField}
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
                  validate={validateEmptyField}
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
                disabled={!editMode}
                format={formatAffiliation}
              />
              {/*<ErrorMessage errorMsg={errors.affiliation} />*/}
            </div>
            {formButton}
          </Form>
        );
      }}
    />
  );
});

interface ProfileFormContainerProps {
  // TODO: change any to specific actions
  dispatch: Dispatch<any>;
}
const ProfileFormContainer: React.FC<ProfileFormContainerProps & ReturnType<typeof mapStateToProps>> = ({
  currentUser,
}) => {
  if (!currentUser.isLoggedIn) return null;

  return (
    <ProfileForm
      firstName={currentUser.firstName}
      lastName={currentUser.lastName || ''}
      affiliation={currentUser.affiliation}
    />
  );
};

function mapStateToProps(state: AppState) {
  return {
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(withStyles<typeof ProfileFormContainer>(s)(ProfileFormContainer));
