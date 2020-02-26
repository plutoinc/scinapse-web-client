import React, { useCallback, useState } from 'react';
import { Formik, Form, FieldArray, ErrorMessage } from 'formik';
import { object, array, string } from 'yup';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../../../icons';
import AuthorUrlsImportField from '../authorUrlsImportField';
import AuthorAPI from '../../../../api/author';
import { HandleImportPaperListParams, IMPORT_SOURCE_TAB } from '../../types';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./authorUrlsImportForm.scss');

const SCINAPSE_AUTHOR_SHOW_REGEX = /^https:\/\/scinapse\.io\/authors\//;
export const SCINAPSE_AUTHOR_SHOW_PREFIX = 'https://scinapse.io/authors/';

export interface AuthorUrlsFormState {
  authorUrls: string[];
}

interface AuthorUrlsImportFormProps {
  isLoading: boolean;
  onSubmitAuthorUrls: (params: HandleImportPaperListParams) => void;
}

const schema = object().shape({
  authorUrls: array()
    .of(
      string().matches(SCINAPSE_AUTHOR_SHOW_REGEX, {
        message: 'Please write valid scinapse author url',
        excludeEmptyString: false,
      })
    )
    .required('Please write at least 1 URL')
    .compact(),
});

const AuthorUrlsImportForm: React.FC<AuthorUrlsImportFormProps> = ({ isLoading, onSubmitAuthorUrls }) => {
  useStyles(s);
  const [isFetchLoading, setIsFetchLoading] = useState<boolean>(false);

  const handleBlurUrlField = useCallback(async (authorUrl: string) => {
    const authorId = authorUrl.split(SCINAPSE_AUTHOR_SHOW_PREFIX)[1];

    if (!authorId) return null;

    setIsFetchLoading(true);
    try {
      const res = await AuthorAPI.getAuthor(authorId);
      const authorData = res.entities.authors[authorId];
      setIsFetchLoading(false);
      return authorData.name;
    } catch (err) {
      setIsFetchLoading(false);
      throw err;
    }
  }, []);

  return (
    <div className={s.formWrapper}>
      <div className={s.formTitle}>URL of author page on scinapse</div>
      <div className={s.formDescription}>
        Copy & Paste the URL of your author page on scinapse.<br />
        (If you are shown on multiple pages, please put all author URLs)
      </div>
      <Formik
        initialValues={{ authorUrls: ['', '', ''] }}
        onSubmit={(values) => onSubmitAuthorUrls({ type: IMPORT_SOURCE_TAB.AUTHOR_URLS, importedContext: values.authorUrls })}
        validationSchema={schema}
        render={({ values, errors }) => (
          <Form autoComplete="off">
            <FieldArray
              name="authorUrls"
              render={({ push, remove }) => {
                return (
                  <div>
                    {values.authorUrls.map((authorUrl, index) => {
                      return (
                        <div className={s.urlInputContainer} key={index}>
                          <AuthorUrlsImportField
                            targetIndex={index}
                            authorUrl={authorUrl}
                            hadError={!!errors.authorUrls && typeof errors.authorUrls === 'object'}
                            onRemoveField={() => remove(index)}
                            onBlurUrlField={handleBlurUrlField}
                          />
                          {values.authorUrls.length > 1 &&
                            index === 0 && (
                              <div className={s.orSeparatorBox}>
                                <div className={s.dashedSeparator} />
                                <div className={s.orContent}>OPTIONAL</div>
                                <div className={s.dashedSeparator} />
                              </div>
                            )}
                        </div>
                      );
                    })}

                    <div className={s.addUrlBtn}>
                      <Button
                        elementType="button"
                        color="black"
                        size="small"
                        aria-label="Add author url column"
                        type="button"
                        variant="text"
                        fullWidth={true}
                        onClick={() => push('')}
                      >
                        <Icon icon="PLUS" />
                        <span>ADD AUTHOR URL</span>
                      </Button>
                    </div>

                    <div className={s.submitBtn}>
                      {errors.authorUrls &&
                        typeof errors.authorUrls === 'string' && (
                          <span className={s.errorMessage}>
                            <ErrorMessage name={`authorUrls`} />
                          </span>
                        )}
                      <Button
                        elementType="button"
                        aria-label="Import paper from author url"
                        type="submit"
                        isLoading={isLoading}
                        disabled={isFetchLoading}
                      >
                        <span>IMPORT</span>
                      </Button>
                    </div>
                  </div>
                );
              }}
            />
          </Form>
        )}
      />
    </div>
  );
};

export default AuthorUrlsImportForm;
