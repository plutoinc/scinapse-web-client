import React from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { object, array, string } from 'yup';
import { Button } from '@pluto_network/pluto-design-elements';
import FormikInput from '../../../../components/common/formikInput';
import Icon from '../../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./authorUrlsImportForm.scss');

const SCINAPSE_AUTHOR_SHOW_REGEX = /scinapse\.io\/authors\//;

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
        validateOnChange={false}
        validateOnBlur={false}
        render={({ values, errors }) => (
          <Form autoComplete="off">
            <FieldArray
              name="authorUrls"
              render={({ push, remove }) => (
                <div>
                  {values.authorUrls.map((_authorUrl, index) => (
                    <div key={index} className={s.urlInputContainer}>
                      <div className={s.inputWrapper}>
                        <Field
                          name={`authorUrls.${index}`}
                          type="text"
                          component={FormikInput}
                          variant="outlined"
                          placeholder="https://scinapse.io/authors/1234"
                        />
                        <Button
                          elementType="button"
                          color="black"
                          aria-label="Remove author url column"
                          type="button"
                          variant="contained"
                          onClick={() => remove(index)}
                          className={s.removeUrlBtn}
                        >
                          <Icon icon="MINUS" />
                        </Button>
                      </div>
                      {errors.authorUrls && typeof errors.authorUrls === 'object' ? (
                        <div className={s.errorMessage}>
                          <ErrorMessage name={`authorUrls.${index}`} />
                        </div>
                      ) : null}
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
              )}
            />
          </Form>
        )}
      />
    </div>
  );
};

export default AuthorUrlsImportForm;
