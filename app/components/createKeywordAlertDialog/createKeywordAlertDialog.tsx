import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, FormikErrors } from 'formik';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import { AppState } from '../../reducers';
import { closeCreateKeywordAlertDialog } from '../../reducers/createKeywordAlertDialog';
import ScinapseFormikInput from '../common/scinapseInput/scinapseFormikInput';
import { Button } from '@pluto_network/pluto-design-elements';
import Icon from '../../icons';
import { createKeywordAlert } from '../../containers/keywordSettings/actions';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./createKeywordAlertDialog.scss');

type FormState = ReturnType<typeof getInitialValues>;

function validateForm(values: FormState) {
  const errors: FormikErrors<FormState> = {};

  if (!values.keyword) {
    errors.keyword = 'Please enter keyword';
  }

  return errors;
}

function getInitialValues(keyword: string) {
  return {
    keyword,
  };
}

const CreateKeywordAlertDialog: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const { isOpen, openFrom, keyword, isLoading } = useSelector((appState: AppState) => ({
    isOpen: appState.createKeywordAlertDialogState.isOpen,
    openFrom: appState.createKeywordAlertDialogState.from,
    keyword: appState.createKeywordAlertDialogState.keyword,
    isLoading: appState.keywordSettingsState.isLoading,
  }));

  function handleClose() {
    dispatch(closeCreateKeywordAlertDialog());
  }

  async function handleSubmitForm(values: FormState) {
    dispatch(createKeywordAlert(values.keyword, openFrom));

    handleClose();
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: s.dialogPaper }}>
      <div className={s.title}>Create keyword alert</div>
      <div className={s.description}>We’ll send email updated papers for the registered keyword.</div>
      <Formik
        initialValues={getInitialValues(keyword)}
        validate={validateForm}
        onSubmit={handleSubmitForm}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        render={({ errors }) => (
          <Form className={s.form}>
            <div className={s.inputWrapper}>
              <label htmlFor="keyword" className={s.detailLabel}>
                KEYWORD
              </label>
              <Field
                name="keyword"
                type="keyword"
                className={classNames({
                  [s.keywordInput]: true,
                  [s.keywordInputError]: !!errors.keyword,
                })}
                placeholder="ex) Nanotechnology"
                icon={!!errors.keyword ? 'ERROR' : null}
                iconclassname={s.errorIcon}
                component={ScinapseFormikInput}
              />
            </div>
            <div className={s.btnWrapper}>
              <Button
                elementType="button"
                aria-label="Create keyword button"
                size="medium"
                variant="contained"
                color="blue"
                type="submit"
                isLoading={isLoading}
              >
                <span>Create</span>
              </Button>
            </div>
          </Form>
        )}
      />
      <div className={s.closeBtnWrapper}>
        <Button
          elementType="button"
          aria-label="Cancel to create keyword button"
          size="small"
          variant="text"
          color="gray"
          fullWidth={false}
          disabled={false}
          onClick={handleClose}
        >
          <Icon icon="X_BUTTON" />
        </Button>
      </div>
    </Dialog>
  );
};

export default CreateKeywordAlertDialog;
