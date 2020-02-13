import React from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import { object, array, string } from 'yup';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../../../icons';
import AuthorUrlsImportField from '../authorUrlsImportField';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./authorUrlsImportForm.scss');

const SCINAPSE_AUTHOR_SHOW_REGEX = /^https:\/\/scinapse\.io\/authors\//;

export interface AuthorUrlsFormState {
  authorUrls: string[];
}

interface AuthorUrlsImportFormProps {
  isLoading: boolean;
  onSubmitAuthorUrls: (params: AuthorUrlsFormState) => void;
}

const schema = object().shape({
  authorUrls: array()
    .of(
      string().matches(SCINAPSE_AUTHOR_SHOW_REGEX, {
        message: 'Please write valid scinapse author url',
        excludeEmptyString: false,
      })
    )
    .required('Please write at least 1 URL'),
});

const AuthorUrlsImportForm: React.FC<AuthorUrlsImportFormProps> = ({ isLoading, onSubmitAuthorUrls }) => {
  useStyles(s);

  return (
    <div className={s.formWrapper}>
      <div className={s.formTitle}>AUTHOR URLS</div>
      <Formik
        initialValues={{ authorUrls: ['', '', ''] }}
        onSubmit={onSubmitAuthorUrls}
        enableReinitialize
        validationSchema={schema}
        render={({ values, errors }) => (
          <Form autoComplete="off">
            <FieldArray
              name="authorUrls"
              render={({ push, remove }) => {
                return (
                  <div>
                    {values.authorUrls.map((authorUrl, index) => (
                      <AuthorUrlsImportField
                        targetIndex={index}
                        authorUrl={authorUrl}
                        onRemoveField={() => remove(index)}
                        hadError={!!errors.authorUrls && typeof errors.authorUrls === 'object'}
                        key={index}
                      />
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
                        onClick={() => push('')}
                      >
                        <Icon icon="PLUS" />
                        <span>ADD AUTHOR URL</span>
                      </Button>
                    </div>

                    <div className={s.submitBtn}>
                      {errors.authorUrls &&
                        typeof errors.authorUrls === 'string' && (
                          <span className={s.errorMessage}>
                            <ErrorMessage name={`authorUrls`} />
                          </span>
                        )}
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
                );
              }}
            />
          </Form>
        )}
      />
    </div>
  );
};

export default AuthorUrlsImportForm;
