import React from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import FormikInput from '../../../../components/common/formikInput';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./citationTextImportForm.scss');

export interface CitationTextFormState {
  citationText: string;
}

interface CitationTextImportFormProps {
  isLoading: boolean;
  onSubmitCitationText: (params: CitationTextFormState) => void;
}

const CitationTextImportForm: React.FC<CitationTextImportFormProps> = props => {
  useStyles(s);

  const { isLoading, onSubmitCitationText } = props;

  return (
    <div className={s.formWrapper}>
      <Formik
        initialValues={{ citationText: '' }}
        onSubmit={onSubmitCitationText}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        render={({ errors }) => (
          <Form autoComplete="off">
            <div>
              <div>
                <Field
                  name="citationText"
                  type="text"
                  labelText="CITATION TEXT"
                  component={FormikInput}
                  error={errors.citationText}
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

export default CitationTextImportForm;
