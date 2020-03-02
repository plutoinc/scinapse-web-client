import React, { useState } from 'react';
import { Formik, Form, Field, FormikErrors } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import FormikInput from '../../../../components/common/formikInput';
import { HandleImportPaperListParams, IMPORT_SOURCE_TAB } from '../../types';
import Icon from '../../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./bibTexImportForm.scss');

const MIN_LENGTH_OF_BIBTEX_STRING = 4;

export interface BibTexFormState {
  bibTexString: string;
}

interface BibTexImportFormProps {
  isLoading: boolean;
  onSubmitBibtex: (params: HandleImportPaperListParams) => void;
}

const validateForm = (values: BibTexFormState) => {
  const errors: FormikErrors<BibTexFormState> = {};

  if (!values.bibTexString || values.bibTexString.length < MIN_LENGTH_OF_BIBTEX_STRING) {
    errors.bibTexString = `Sorry. You should fill at least ${MIN_LENGTH_OF_BIBTEX_STRING} length of BibTex text.`;
  }

  return errors;
};

const BibTexImportForm: React.FC<BibTexImportFormProps> = props => {
  useStyles(s);

  const { isLoading, onSubmitBibtex } = props;
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
        initialValues={{ bibTexString: bibTexString }}
        validate={validateForm}
        onSubmit={values => onSubmitBibtex({ type: IMPORT_SOURCE_TAB.BIBTEX, importedContext: values.bibTexString })}
        enableReinitialize
        render={({ errors, touched }) => (
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
                      {!targetFile ? (
                        <span className={s.uploaderGuideContext}>
                          <Icon icon="CLOUD_UPLOAD" className={s.uploadIcon} />
                          Drop BibTex file here or upload a file.
                        </span>
                      ) : (
                        targetFile.name
                      )}
                    </div>
                  </div>
                  <label htmlFor="bibTexFile" className={s.bibTexFileUploaderButton}>
                    Upload
                  </label>
                </div>
                <div className={s.orSeparatorBox}>
                  <div className={s.dashedSeparator} />
                  <div className={s.orContent}>or</div>
                  <div className={s.dashedSeparator} />
                </div>
                <Field
                  name="bibTexString"
                  type="text"
                  labelText="BIBTEX TEXT"
                  component={FormikInput}
                  error={touched.bibTexString && errors.bibTexString}
                  helperText="Write or Copy & Paste BibTex text above"
                  placeholder="Write or Copy & Paste BibTex text above"
                  variant="underlined"
                  className={s.bibtexTextArea}
                  multiline
                />
              </div>
              <div className={s.submitBtn}>
                <Button
                  elementType="button"
                  aria-label="Import paper from BibTex text"
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

export default BibTexImportForm;
