import React from 'react';
import { Formik, Form, Field, FieldArray } from 'formik';
import FormikInput from '../../../../components/common/formikInput';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../../../icons';

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
      <div className={s.formTitle}>AUTHOR URLS</div>
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
                    <div key={index} className={s.inputWrapper}>
                      <Field name={`authorUrls.${index}`} type="text" component={FormikInput} variant="outlined" />
                    </div>
                  ))}
                  <div className={s.addUrlBtn}>
                    <Button
                      elementType="button"
                      color="black"
                      size="small"
                      aria-label="Add author url column"
                      type="button"
                      variant="text"
                      fullWidth={true}
                      onClick={() => arrayHelpers.push('')}
                    >
                      <Icon icon="PLUS" />
                      <span>ADD AUTHOR URL</span>
                    </Button>
                  </div>
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
