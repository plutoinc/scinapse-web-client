import React from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form, FormikErrors, Field, FormikActions } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import { createKeywordAlert } from '../../containers/keywordSettings/actions';
import FormikInput from '../common/formikInput';
import Icon from '../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./createKeywordInput.scss');

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

interface CreateKeywordInputProps {
  isLoggedIn: boolean;
  isLoading: boolean;
}

const CreateKeywordInput: React.FC<CreateKeywordInputProps> = ({ isLoggedIn, isLoading }) => {
  useStyles(s);
  const dispatch = useDispatch();

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
          <div className={s.formWrapper}>
            <div className={s.inputFieldWrapper}>
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
              className={s.submitButton}
              elementType="button"
              aria-label="Create keyword button"
              type="submit"
              isLoading={isLoading}
              disabled={!isLoggedIn}
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
