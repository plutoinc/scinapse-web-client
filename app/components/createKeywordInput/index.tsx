import React from 'react';
import { useDispatch } from 'react-redux';
import { createKeywordAlert } from '../../containers/keywordSettings/actions';
import { Formik, Form, FormikErrors, Field, FormikActions } from 'formik';
import FormikInput from '../common/formikInput';
import Icon from '../../icons';

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
          <div>
            <Field
              name="keyword"
              type="keyword"
              labelText="CREATE KEYWORD ALERT"
              component={FormikInput}
              trailingIcon={<Icon icon="PLUS" />}
              error={errors.keyword}
              helperText="ex ) machine learning"
              placeholder="Write keywords here."
              variant="underlined"
            />
          </div>
        </Form>
      )}
    />
  );
};

export default CreateKeywordInput;
