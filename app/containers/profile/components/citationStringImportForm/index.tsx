import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import FormikInput from '../../../../components/common/formikInput';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./citationStringImportForm.scss');

export interface CitationStringFormState {
  citationString: string;
}

interface CitationStringImportFormProps {
  isLoading: boolean;
  onSubmitCitationString: (params: CitationStringFormState) => void;
}

const CitationStringImportForm: React.FC<CitationStringImportFormProps> = props => {
  useStyles(s);

  const { isLoading, onSubmitCitationString } = props;

  return (
    <div className={s.formWrapper}>
      <Formik
        initialValues={{ citationString: '' }}
        onSubmit={onSubmitCitationString}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
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
