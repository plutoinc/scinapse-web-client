import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Field, Form, Formik } from 'formik';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import AffiliationSelectBox from '../../components/dialog/components/modifyProfile/affiliationSelectBox';
import { withStyles } from '../../helpers/withStylesHelper';
import { AppState } from '../../reducers';

const s = require('./profileForm.scss');

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}
interface ProfileFormProps {
  firstName: string;
  lastName: string;
  affiliation: string;
}
const ProfileForm: React.FC<ProfileFormProps> = React.memo(props => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);

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
    formButton = <button type="submit">Save changes</button>;
  }

  return (
    <Formik
      initialValues={{ firstName: props.firstName, lastName: props.lastName, affiliation: props.affiliation }}
      onSubmit={() => {}}
      validate={() => {}}
      validateOnChange={false}
      enableReinitialize
      render={() => {
        return (
          <Form>
            <div className={s.formRow}>
              <div className={s.formWrapper}>
                <label className={s.formLabel}>FIRST NAME</label>
                <Field className={s.inputForm} name="firstName" placeholder="First Name" />
              </div>
              <div className={s.formWrapper}>
                <label className={s.formLabel}>LAST NAME</label>
                <Field className={s.inputForm} name="lastName" placeholder="Last Name" />
              </div>
            </div>
            <Field
              name="affiliation"
              component={AffiliationSelectBox}
              placeholder="Affiliation / Company"
              className={s.inputField}
              format={formatAffiliation}
            />
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
