import React, { FC, useState, useCallback } from 'react';
import { ErrorMessage, Field } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../../../icons';
import FormikInput from '../../../../components/common/formikInput';
import PlutoAxios from '../../../../api/pluto';
import alertToast from '../../../../helpers/makePlutoToastAction';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./authorUrlsImportField.scss');

interface AuthorUrlsImportFieldProps {
  targetIndex: number;
  authorUrl: string;
  hadError: boolean;
  onRemoveField: () => void;
  onBlurUrlField: (authorUrl: string) => Promise<string | null>;
}

const AuthorUrlsImportField: FC<AuthorUrlsImportFieldProps> = ({
  targetIndex,
  authorUrl,
  onRemoveField,
  onBlurUrlField,
  hadError,
}) => {
  useStyles(s);
  const [authorName, setAuthorName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAuthorNameFromAuthorUrl = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetAuthorName = await onBlurUrlField(authorUrl);

      if (!targetAuthorName) {
        setAuthorName('');
        setIsLoading(false);
        return;
      }

      setAuthorName(targetAuthorName);
      setIsLoading(false);
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({ type: 'error', message: error.message });
      setAuthorName(error.message);
      setIsLoading(false);
    }
  }, [authorUrl, onBlurUrlField]);

  return (
    <div>
      <div className={s.inputWrapper}>
        <Field
          name={`authorUrls.${targetIndex}`}
          type="text"
          component={FormikInput}
          variant="outlined"
          placeholder="https://scinapse.io/authors/1234"
          onBlur={fetchAuthorNameFromAuthorUrl}
          onChange={fetchAuthorNameFromAuthorUrl}
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              fetchAuthorNameFromAuthorUrl();
            }
          }}
          disabled={isLoading}
        />
        <Button
          elementType="button"
          color="black"
          aria-label="Remove author url column"
          type="button"
          variant="contained"
          onClick={() => {
            onRemoveField();
            setAuthorName('');
          }}
          className={s.removeUrlBtn}
          isLoading={isLoading}
        >
          <Icon icon="MINUS" />
        </Button>
      </div>
      {authorName && <div className={s.authorNameText}>{authorName}</div>}
      {hadError && (
        <div className={s.errorMessage}>
          <ErrorMessage name={`authorUrls.${targetIndex}`} />
        </div>
      )}
    </div>
  );
};

export default AuthorUrlsImportField;
