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
                  helperText="Write citation text."
                  placeholder={'Write citation text.'}
                  variant="underlined"
                  multiline={true}
                />
                <div className={s.guideContext}>
                  ※ Please input citation text while paying attention to delimiter characters.
                </div>
              </div>
              <div className={s.submitBtn}>
                <Button
                  elementType="button"
                  aria-label="Import paper from citation text"
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

export default CitationStringImportForm;
