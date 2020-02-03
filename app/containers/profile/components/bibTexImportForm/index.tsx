import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import FormikInput from '../../../../components/common/formikInput';
import { Button, InputField } from '@pluto_network/pluto-design-elements';

export interface BibTexFormState {
  bibTexStr: string;
}

interface BibTexImportFormProps {
  isLoading: boolean;
  handleBibTexSubmit: (params: BibTexFormState) => void;
}

const BibTexImportForm: React.FC<BibTexImportFormProps> = props => {
  const { isLoading, handleBibTexSubmit } = props;
  const [bibTexString, setBibTexString] = useState<string>('');

  const fileChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files[0];

      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF8');
      fileReader.onload = () => {
        if (!fileReader.result) return;

        setBibTexString(String(fileReader.result));
      };
    }
  };

  return (
    <div>
      <Formik
        initialValues={{ bibTexStr: bibTexString }}
        onSubmit={handleBibTexSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        render={({ errors }) => (
          <Form autoComplete="off">
            <div>
              <div>
                <InputField
                  type="file"
                  accept=".bib"
                  labelText="BIBTEX FILE"
                  helperText="Write bibTex file here."
                  placeholder={'Write bibTex file here.'}
                  variant="underlined"
                  onChange={fileChangedHandler}
                />
                <Field
                  name="bibTexStr"
                  type="text"
                  labelText="BIBTEX STRING"
                  component={FormikInput}
                  error={errors.bibTexStr}
                  helperText="Write bibTex string."
                  placeholder={'Write bibTex string.'}
                  variant="underlined"
                  multiline={true}
                />
              </div>
              <Button
                elementType="button"
                aria-label="Import paper from bibTex string"
                type="submit"
                isLoading={isLoading}
              >
                <span>SEND STRING</span>
              </Button>
            </div>
          </Form>
        )}
      />
    </div>
  );
};

export default BibTexImportForm;
