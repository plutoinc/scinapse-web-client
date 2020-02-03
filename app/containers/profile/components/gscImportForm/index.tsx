import React from 'react';
import { parse as QueryParse } from 'qs';
import { parse as URLParse } from 'url';
import { Formik, FormikErrors, Form, Field } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import FormikInput from '../../../../components/common/formikInput';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./gscImportForm.scss');

const GOOGLE_SCHOLAR_URL_PREFIX = 'https://scholar.google.com/citations?';

export interface GscFormState {
  url: string;
}

interface GscImportFormProps {
  isLoading: boolean;
  handleGscSubmit: (params: GscFormState) => void;
}

function gscImportValidateForm(values: GscFormState) {
  const errors: FormikErrors<GscFormState> = {};

  const targetUrl = values.url;
  const targetUrlQuery = URLParse(targetUrl).query || '';

  if (!targetUrl || !targetUrl.includes(GOOGLE_SCHOLAR_URL_PREFIX) || !targetUrlQuery) {
    errors.url = 'Please enter google scholar profile url';
    return errors;
  }

  const targetUrlQueryObj = QueryParse(targetUrlQuery, { ignoreQueryPrefix: true });

  if (!targetUrlQueryObj.user) {
    errors.url = 'Please enter google scholar profile url include user query value';
  }

  return errors;
}

const GscImportForm: React.FC<GscImportFormProps> = props => {
  useStyles(s);

  const { isLoading, handleGscSubmit } = props;

  return (
    <div className={s.formWrapper}>
      <Formik
        initialValues={{ url: '' }}
        validate={gscImportValidateForm}
        onSubmit={handleGscSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        render={({ errors }) => (
          <Form autoComplete="off">
            <div>
              <div>
                <Field
                  name="url"
                  type="url"
                  labelText="GOOGLE SCHOLAR PROFILE URL"
                  component={FormikInput}
                  error={errors.url}
                  helperText="https://scholar.google.com/citations?user={your id}"
                  placeholder={'Write google scholar profile url here.'}
                  variant="underlined"
                />
              </div>
              <div className={s.submitBtn}>
                <Button
                  elementType="button"
                  aria-label="Import paper on gsc profile link"
                  type="submit"
                  isLoading={isLoading}
                >
                  <span>IMPORT</span>
                </Button>
              </div>
            </div>
          </Form>
        )}
      />
    </div>
  );
};

export default GscImportForm;
