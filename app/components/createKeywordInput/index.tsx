import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createKeywordAlert } from '../../containers/keywordSettings/actions';
import { Formik, Form, FormikErrors, Field, FormikActions } from 'formik';
import FormikInput from '../common/formikInput';
import Icon from '../../icons';
import { Button } from '@pluto_network/pluto-design-elements';
import { AppState } from '../../reducers';

type FormState = ReturnType<typeof getInitialValues>;

function validateForm(values: FormState) {
  const errors: FormikErrors<FormState> = {};

  if (!values.keyword) {
    errors.keyword = 'Please enter keyword';
  }

  return errors;
}

function getInitialValues(keyword: string) {
  return {
    keyword,
  };
}

const CreateKeywordInput: React.FC = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((appState: AppState) => ({
    isLoggedIn: appState.currentUser.isLoggedIn,
    isLoading: appState.keywordSettingsState.isLoading,
  }));

  async function handleSubmitForm(values: FormState, actions: FormikActions<FormState>) {
    await dispatch(createKeywordAlert(values.keyword, 'keywordSettingPage'));
    actions.resetForm();
  }

  return (
    <Formik
      initialValues={getInitialValues('')}
      validate={validateForm}
      onSubmit={handleSubmitForm}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={false}
      render={({ errors }) => (
        <Form autoComplete="off">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '8px', width: '100%' }}>
              <Field
                name="keyword"
                type="keyword"
                labelText="CREATE KEYWORD ALERT"
                component={FormikInput}
                error={errors.keyword}
                helperText="ex ) machine learning"
                placeholder={!isLoggedIn ? 'Please sign in first.' : 'Write keywords here.'}
                variant="underlined"
                disabled={!isLoggedIn}
              />
            </div>
            <Button
              elementType="button"
              type="submit"
              style={{
                height: `44px`,
                marginTop: '4px',
              }}
              isLoading={isLoading}
              disabled={!isLoggedIn || isLoading}
            >
              <Icon icon="PLUS" />
            </Button>
          </div>
        </Form>
      )}
    />
  );
};

export default CreateKeywordInput;
