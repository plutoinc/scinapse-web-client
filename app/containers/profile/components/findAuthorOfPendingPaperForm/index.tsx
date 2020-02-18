import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { Button, InputField } from '@pluto_network/pluto-design-elements';
import AuthorAPI from '../../../../api/author';
import { PaperAuthor } from '../../../../model/author';
import { resolvedPendingPaper } from '../../../../actions/profile';
import HIndexBox from '../../../../components/common/hIndexBox';
import CircularProgress from '@material-ui/core/CircularProgress';
import Icon from '../../../../icons';

const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./findAuthorOfPendingPaperForm.scss');

interface FindAuthorOfPendingPaperFormProps {
  targetResolvedPaperId: string;
  pendingPaperId: string;
  onCloseDialog: () => void;
}

interface AuthorItemProps {
  author: PaperAuthor;
  isChecked: boolean;
  onChange: () => void;
}

interface AuthorListProps {
  isLoading: boolean;
  authors: PaperAuthor[];
  currentCheckedValue: string | null;
  handleOnChange: (authorId: string) => void;
}

interface FormState {
  authorIdFromTargetResolvedPaper: string | null;
}

const AuthorItem: FC<AuthorItemProps> = ({ author, isChecked, onChange }) => {
  return (
    <div className={s.itemContainer} onClick={onChange}>
      <div className={s.checkBox}>
        <input
          type="radio"
          className={s.checkBox}
          name="authorIdFromTargetResolvedPaper"
          value={author.id}
          checked={isChecked}
          readOnly
        />
      </div>
      <div className={s.itemWrapper}>
        <div className={s.authorMajorInfo}>
          <div className={s.authorName}>{author.name}</div>
          <div className={s.affiliation}>{author.affiliation && author.affiliation.name}</div>
        </div>
        <div className={s.hIndexBox}>
          <HIndexBox hIndex={author.hindex} />
        </div>
      </div>
    </div>
  );
};

const AuthorList: FC<AuthorListProps> = ({ isLoading, authors, currentCheckedValue, handleOnChange }) => {
  if (isLoading) {
    return (
      <div className={s.spinnerWrapper}>
        <CircularProgress className={s.loadingSpinner} disableShrink={true} size={20} thickness={4} />
      </div>
    );
  }

  if (authors.length === 0) {
    return <div className={s.noAuthorResultContext}>NO AUTHOR RESULT</div>;
  }

  return (
    <>
      {authors.map(author => (
        <AuthorItem
          key={author.id}
          author={author}
          isChecked={currentCheckedValue === author.id}
          onChange={() => handleOnChange(author.id)}
        />
      ))}
    </>
  );
};

const FindAuthorOfPendingPaperForm: FC<FindAuthorOfPendingPaperFormProps> = ({
  targetResolvedPaperId,
  pendingPaperId,
  onCloseDialog,
}) => {
  useStyles(s);
  const dispatch = useDispatch();
  const [authorsFromTargetResolvedPaper, setAuthorsFromTargetResolvedPaper] = useState<PaperAuthor[]>([]);
  const [filteredAuthor, setFilteredAuthor] = useState<PaperAuthor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchAuthorKeyword, setSearchAuthorKeyword] = useState<string>('');

  useEffect(
    () => {
      const getAuthorsFromResolvedPaper = async () => {
        const res = await AuthorAPI.getAllAuthors(targetResolvedPaperId);
        setAuthorsFromTargetResolvedPaper(res);
        setIsLoading(false);
      };

      setIsLoading(true);
      getAuthorsFromResolvedPaper();
    },
    [dispatch, targetResolvedPaperId]
  );

  const onClickSubmitBtn = (value: FormState) => {
    dispatch(resolvedPendingPaper(pendingPaperId, targetResolvedPaperId, value.authorIdFromTargetResolvedPaper));
    onCloseDialog();
  };

  const searchAuthor = () => {
    if (authorsFromTargetResolvedPaper.length === 0) return;

    const filteredRes = authorsFromTargetResolvedPaper.filter(author => author.name.includes(searchAuthorKeyword));
    setFilteredAuthor(filteredRes);
  };

  return (
    <div>
      <div className={s.searchAuthorInputWrapper}>
        <InputField
          name="searchAuthorKeyword"
          type="text"
          placeholder="Search for an author name here."
          onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
              searchAuthor();
            }
          }}
          onChange={e => {
            setSearchAuthorKeyword(e.currentTarget.value);
            searchAuthor();
          }}
        />
        <Button
          elementType="button"
          type="button"
          color="gray"
          variant="contained"
          className={s.searchButton}
          onClick={() => searchAuthor()}
        >
          <Icon icon="SEARCH" />
        </Button>
      </div>

      <Formik
        initialValues={{ authorIdFromTargetResolvedPaper: null }}
        onSubmit={onClickSubmitBtn}
        enableReinitialize
        render={({ values, setFieldValue }) => (
          <Form>
            <div className={s.itemListWrapper}>
              <div className={s.itemContainer} onClick={() => setFieldValue('authorIdFromTargetResolvedPaper', null)}>
                <div className={s.checkBox}>
                  <input
                    type="radio"
                    className={s.checkBox}
                    name="authorIdFromTargetResolvedPaper"
                    checked={values.authorIdFromTargetResolvedPaper === null}
                    readOnly
                  />
                </div>
                <div className={s.itemWrapper}>
                  <div className={s.authorName}>Not Exist</div>
                </div>
              </div>
              <AuthorList
                isLoading={isLoading}
                currentCheckedValue={values.authorIdFromTargetResolvedPaper}
                authors={!searchAuthorKeyword ? authorsFromTargetResolvedPaper : filteredAuthor}
                handleOnChange={(authorId: string) => setFieldValue('authorIdFromTargetResolvedPaper', authorId)}
              />
            </div>
            <div className={s.footerButtonWrapper}>
              <Button elementType="button" color="black" variant="text" onClick={onCloseDialog} type="button">
                <span>CANCEL</span>
              </Button>
              <Button elementType="button" color="blue" variant="contained" type="submit">
                <span>SUBMIT</span>
              </Button>
            </div>
          </Form>
        )}
      />
    </div>
  );
};

export default FindAuthorOfPendingPaperForm;
