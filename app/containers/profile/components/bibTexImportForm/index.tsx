import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import FormikInput from '../../../../components/common/formikInput';
import { Button, InputField } from '@pluto_network/pluto-design-elements';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./bibTexImportForm.scss');

export interface BibTexFormState {
  bibTexStr: string;
}

interface BibTexImportFormProps {
  isLoading: boolean;
  handleBibTexSubmit: (params: BibTexFormState) => void;
}

const BibTexImportForm: React.FC<BibTexImportFormProps> = props => {
  useStyles(s);

  const { isLoading, handleBibTexSubmit } = props;
  const [bibTexString, setBibTexString] = useState<string>('');
  const [targetFile, setTargetFile] = useState<File | null>(null);

  const fileChangedHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file = e.currentTarget.files[0];
      setTargetFile(file);

      const fileReader = new FileReader();
      fileReader.readAsText(file, 'UTF8');
      fileReader.onload = () => {
        if (!fileReader.result) return;

        setBibTexString(String(fileReader.result));
      };
    }
  };

  return (
    <div className={s.formWrapper}>
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
                <div className={s.bibTexFileUploaderContainer}>
                  <div className={s.bibTexFileUploaderWrapper}>
                    <input
                      type="file"
                      id="bibTexFile"
                      accept=".bib"
                      onChange={fileChangedHandler}
                      className={s.bibTexFileUploader}
                    />
                    <div className={s.bibTexFileUploadSection}>
                      {!targetFile ? `Drop File here or click UPLOAD button` : targetFile.name}
                    </div>
                  </div>
                  <label htmlFor="bibTexFile" className={s.bibTexFileUploaderButton}>
                    UPLOAD
                  </label>
                </div>
                <div className={s.orSeparatorBox}>
                  <div className={s.dashedSeparator} />
                  <div className={s.orContent}>or</div>
                  <div className={s.dashedSeparator} />
                </div>
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
              <div className={s.submitBtn}>
                <Button
                  elementType="button"
                  aria-label="Import paper from bibTex string"
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

export default BibTexImportForm;
