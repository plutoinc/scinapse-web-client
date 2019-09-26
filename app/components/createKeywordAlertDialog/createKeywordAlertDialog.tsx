import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import { AppState } from '../../reducers';
import { closeCreateKeywordAlertDialog } from '../../reducers/createKeywordAlertDialog';
import {
  startToConnectKeywordSettingsAPI,
  succeedToConnectKeywordSettingsAPI,
  failedToConnectKeywordSettingsAPI,
} from '../../reducers/keywordSettings';
import MemberAPI from '../../api/member';
import { ACTION_TYPES } from '../../actions/actionTypes';
import ScinapseFormikInput from '../common/scinapseInput/scinapseFormikInput';
import Button from '../common/button';
import ActionTicketManager from '../../helpers/actionTicketManager';
import { getCurrentPageType } from '../locationListener';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./createKeywordAlertDialog.scss');

type FormState = ReturnType<typeof getInitialValues>;

function getInitialValues() {
  return {
    keyword: '',
  };
}

const CreateKeywordAlertDialog: React.FC = () => {
  useStyles(s);
  const dispatch = useDispatch();
  const { isOpen, openFrom, isLoading } = useSelector((appState: AppState) => ({
    isOpen: appState.createKeywordAlertDialogState.isOpen,
    openFrom: appState.createKeywordAlertDialogState.from,
    isLoading: appState.keywordSettingsState.isLoading,
  }));
  const actionArea = openFrom;

  function handleClose() {
    dispatch(closeCreateKeywordAlertDialog());
  }

  async function handleSubmitForm(values: FormState) {
    dispatch(startToConnectKeywordSettingsAPI());

    await MemberAPI.newKeywordSettings(values.keyword)
      .then(res => {
        dispatch(succeedToConnectKeywordSettingsAPI({ keywords: res.data.content }));
        ActionTicketManager.trackTicket({
          pageType: getCurrentPageType(),
          actionType: 'fire',
          actionArea: actionArea,
          actionTag: 'createKeywordAlert',
          actionLabel: values.keyword,
        });
      })
      .catch(err => {
        dispatch(failedToConnectKeywordSettingsAPI());
        dispatch({
          type: ACTION_TYPES.GLOBAL_ALERT_NOTIFICATION,
          payload: {
            type: 'error',
            message: err,
          },
        });
      });
    handleClose();
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} classes={{ paper: s.dialogPaper }}>
      <div className={s.title}>Create keyword alert</div>
      <Formik
        initialValues={getInitialValues()}
        onSubmit={handleSubmitForm}
        enableReinitialize
        render={() => (
          <Form className={s.form}>
            <div className={s.inputWrapper}>
              <label htmlFor="keyword" className={s.detailLabel}>
                KEYWORD
              </label>
              <Field
                name="keyword"
                type="keyword"
                className={s.keywordInput}
                placeholder="ex) Nanotechnology"
                component={ScinapseFormikInput}
              />
            </div>
            <div className={s.btnWrapper}>
              <Button
                elementType="button"
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
    </Dialog>
  );
};

export default CreateKeywordAlertDialog;
