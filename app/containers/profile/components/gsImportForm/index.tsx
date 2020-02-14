import React from 'react';
import { parse as QueryParse } from 'qs';
import { parse as URLParse } from 'url';
import { Formik, FormikErrors, Form, Field } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import FormikInput from '../../../../components/common/formikInput';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./gsImportForm.scss');

const GOOGLE_SCHOLAR_URL_PREFIX = 'https://scholar.google.com/citations?';

export interface GSFormState {
  url: string;
}

interface GSImportFormProps {
  isLoading: boolean;
  onSubmitGS: (params: GSFormState) => void;
}

function gsImportValidateForm(values: GSFormState) {
  const errors: FormikErrors<GSFormState> = {};

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

const GSImportForm: React.FC<GSImportFormProps> = props => {
  useStyles(s);

  const { isLoading, onSubmitGS } = props;

  return (
    <div className={s.formWrapper}>
      <Formik
        initialValues={{ url: '' }}
        validate={gsImportValidateForm}
        onSubmit={onSubmitGS}
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
                  helperText={`Copy & Paste your Google Scholar Profile URL above. Then click "Import"`}
                  placeholder={'https://scholar.google.com/citations?user={your id}'}
                  variant="underlined"
                />
                <div className={s.guideContext}>
                  ※ Your name on Scinapse must match the name on the Google Scholar profile page.
                </div>
              </div>
              <div className={s.submitBtn}>
                <Button
                  elementType="button"
                  aria-label="Import paper on gs profile link"
                  type="submit"
                  isLoading={isLoading}
                >
                  <span>Import</span>
                </Button>
              </div>
            </div>
          </Form>
        )}
      />
    </div>
  );
};

export default GSImportForm;
