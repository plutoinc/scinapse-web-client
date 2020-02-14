import React, { FC, useState, useCallback } from 'react';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../../../icons';
import { ErrorMessage, Field } from 'formik';
import FormikInput from '../../../../components/common/formikInput';
import AuthorAPI from '../../../../api/author';
import PlutoAxios from '../../../../api/pluto';
import alertToast from '../../../../helpers/makePlutoToastAction';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./authorUrlsImportField.scss');

export const SCINAPSE_AUTHOR_SHOW_PREFIX = 'https://scinapse.io/authors/';

interface AuthorUrlsImportFieldProps {
  targetIndex: number;
  authorUrl: string;
  onRemoveField: () => void;
  hadError: boolean;
}

const AuthorUrlsImportField: FC<AuthorUrlsImportFieldProps> = ({ targetIndex, authorUrl, onRemoveField, hadError }) => {
  useStyles(s);
  const [authorName, setAuthorName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onBlurUrlField = useCallback(
    async () => {
      const authorId = authorUrl.split(SCINAPSE_AUTHOR_SHOW_PREFIX)[1];
      if (authorId) {
        setIsLoading(true);
        try {
          const res = await AuthorAPI.getAuthor(authorId);
          const authorData = res.entities.authors[authorId];
          setAuthorName(authorData.name);
          setIsLoading(false);
        } catch (err) {
          const error = PlutoAxios.getGlobalError(err);
          alertToast({ type: 'error', message: error.message });
          setAuthorName(error.message);
          setIsLoading(false);
        }
      }
    },
    [authorUrl]
  );

  return (
    <div className={s.urlInputContainer}>
      <div className={s.inputWrapper}>
        <Field
          name={`authorUrls.${targetIndex}`}
          type="text"
          component={FormikInput}
          variant="outlined"
          placeholder="https://scinapse.io/authors/1234"
          onBlur={onBlurUrlField}
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
      {hadError ? (
        <div className={s.errorMessage}>
          <ErrorMessage name={`authorUrls.${targetIndex}`} />
        </div>
      ) : null}
    </div>
  );
};

export default AuthorUrlsImportField;
