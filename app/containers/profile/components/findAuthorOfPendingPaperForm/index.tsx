import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import { Button } from '@pluto_network/pluto-design-elements';
import AuthorAPI from '../../../../api/author';
import { PaperAuthor } from '../../../../model/author';
import { resolvedPendingPaper } from '../../../../actions/profile';

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

interface FormState {
  authorIdFromTargetResolvedPaper: string | null;
}

const AuthorItem: FC<AuthorItemProps> = ({ author, isChecked, onChange }) => {
  return (
    <div>
      <input
        type="radio"
        className={s.checkBox}
        name="authorIdFromTargetResolvedPaper"
        value={author.id}
        checked={isChecked}
        onChange={onChange}
        readOnly
      />
      <div>{author.name}</div>
      <div>{author.affiliation && author.affiliation.name}</div>
      <div>{`H-index : ${author.hindex}`}</div>
    </div>
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

  useEffect(
    () => {
      const getAuthorsFromResolvedPaper = async () => {
        const res = await AuthorAPI.getAllAuthors(targetResolvedPaperId);
        setAuthorsFromTargetResolvedPaper(res);
      };

      getAuthorsFromResolvedPaper();
    },
    [dispatch, targetResolvedPaperId]
  );

  const onClickSubmitBtn = (value: FormState) => {
    dispatch(resolvedPendingPaper(pendingPaperId, targetResolvedPaperId, value.authorIdFromTargetResolvedPaper));
    onCloseDialog();
  };

  return (
    <div>
      <Formik
        initialValues={{ authorIdFromTargetResolvedPaper: null }}
        onSubmit={onClickSubmitBtn}
        enableReinitialize
        render={({ values, setFieldValue }) => (
          <Form>
            <div>
              <input
                type="radio"
                className={s.checkBox}
                name="authorIdFromTargetResolvedPaper"
                checked={values.authorIdFromTargetResolvedPaper === null}
                onChange={() => setFieldValue('authorIdFromTargetResolvedPaper', null)}
                readOnly
              />
              <span>Not Exist</span>
            </div>
            {authorsFromTargetResolvedPaper.map(author => (
              <AuthorItem
                key={author.id}
                author={author}
                isChecked={values.authorIdFromTargetResolvedPaper === author.id}
                onChange={() => setFieldValue('authorIdFromTargetResolvedPaper', author.id)}
              />
            ))}
            <div>
              <Button elementType="button" color="blue" variant="text" onClick={onCloseDialog}>
                <span>Cancel</span>
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
