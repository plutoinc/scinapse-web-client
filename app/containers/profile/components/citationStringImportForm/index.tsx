import React from 'react';
import { Formik, Form, Field, FormikErrors } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import FormikInput from '../../../../components/common/formikInput';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./citationStringImportForm.scss');

const MIN_LENGTH_OF_BIBTEX_STRING = 3;

export interface CitationStringFormState {
  citationString: string;
}

interface CitationStringImportFormProps {
  isLoading: boolean;
  onSubmitCitationString: (params: CitationStringFormState) => void;
}

const validateForm = (values: CitationStringFormState) => {
  const errors: FormikErrors<CitationStringFormState> = {};

  if (!values.citationString || values.citationString.length < MIN_LENGTH_OF_BIBTEX_STRING) {
    errors.citationString = `Sorry. You should fill at least ${MIN_LENGTH_OF_BIBTEX_STRING} length of BibTex text.`;
  }

  return errors;
};

const CitationStringImportForm: React.FC<CitationStringImportFormProps> = props => {
  useStyles(s);

  const { isLoading, onSubmitCitationString } = props;

  return (
    <div className={s.formWrapper}>
      <Formik
        initialValues={{ citationString: '' }}
        onSubmit={onSubmitCitationString}
        validate={validateForm}
        enableReinitialize
        render={({ errors }) => (
          <Form autoComplete="off">
            <div>
              <div>
                <Field
                  name="citationString"
                  type="text"
                  labelText="CITATION TEXT"
                  component={FormikInput}
                  error={errors.citationString}
                  helperText="Write or Copy & Paste your citation text above."
                  placeholder="Write or Copy & Paste your citation text above."
                  variant="underlined"
                  className={s.citationTextArea}
                  multiline
                />
                <div className={s.guideContext}>
                  ※ You can enter your entire citation list in any citation format. But please pay attention to
                  inaccurate spacing, commas, and periods.
                </div>
              </div>
              <div className={s.submitBtn}>
                <Button
                  elementType="button"
                  aria-label="Import paper from citation text"
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

export default CitationStringImportForm;
