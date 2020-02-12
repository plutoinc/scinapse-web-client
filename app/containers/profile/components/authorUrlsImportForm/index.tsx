import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import FormikInput from '../../../../components/common/formikInput';
import { Button } from '@pluto_network/pluto-design-elements';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./authorUrlsImportForm.scss');

export interface AuthorUrlsFormState {
  authorUrls: string[];
}

interface AuthorUrlsImportFormProps {
  isLoading: boolean;
  onSubmitAuthorUrls: (params: AuthorUrlsFormState) => void;
}

const AuthorUrlsImportForm: React.FC<AuthorUrlsImportFormProps> = ({ isLoading, onSubmitAuthorUrls }) => {
  useStyles(s);

  return (
    <div className={s.formWrapper}>
      <Formik
        initialValues={{ authorUrls: ['', '', ''] }}
        onSubmit={onSubmitAuthorUrls}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        render={({ values }) => (
          <Form autoComplete="off">
            <FieldArray
              name="authorUrls"
              render={arrayHelpers => (
                <div>
                  {values.authorUrls.map((_authorUrl, index) => (
                    <div key={index}>
                      <Field
                        name={`authorUrls.${index}`}
                        type="text"
                        labelText="SCINAPSE AUTHOR URL"
                        component={FormikInput}
                        helperText="Write scinapse author url."
                        placeholder={'Write scinapse author url.'}
                        variant="outlined"
                      />
                    </div>
                  ))}
                  <button type="button" onClick={() => arrayHelpers.push('')}>
                    Add a Author
                  </button>
                  <div className={s.submitBtn}>
                    <Button
                      elementType="button"
                      aria-label="Import paper from author url"
                      type="submit"
                      isLoading={isLoading}
                    >
                      <span>IMPORT</span>
                    </Button>
                  </div>
                </div>
              )}
            />
          </Form>
        )}
      />
    </div>
  );
};

export default AuthorUrlsImportForm;
