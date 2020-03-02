import React, { FC, useState } from 'react';
import { Formik, Form, Field, FormikErrors } from 'formik';
import { useSelector } from 'react-redux';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import { Button } from '@pluto_network/pluto-design-elements';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import classNames from 'classnames';
import Store from 'store';
import ProfileAPI from '../../api/profile';
import { Affiliation } from '../../model/affiliation';
import { SuggestAffiliation } from '../../api/suggest';
import AffiliationSelectBox from '../dialog/components/modifyProfile/affiliationSelectBox';
import Icon from '../../icons';
import { UserDevice } from '../layouts/reducer';
import { AppState } from '../../reducers';
import FormikInput from '../common/formikInput';
import { ProfileRequestKey } from '../../constants/profileRequest';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./requestProfileForm.scss');

interface FormValues {
  firstName: string;
  lastName: string;
  affiliation: Affiliation | SuggestAffiliation;
  email: string;
}

function formatAffiliation(value?: Affiliation | SuggestAffiliation | string) {
  if (value && (value as Affiliation).name) {
    return (value as Affiliation).name;
  } else if (value && (value as SuggestAffiliation).keyword) {
    return (value as SuggestAffiliation).keyword;
  }
  return value;
}

const validateForm = (values: FormValues) => {
  const errors: FormikErrors<FormValues> = {};
  const { email, firstName, lastName, affiliation } = values;

  if (!email) {
    errors.email = 'Please enter the valid email';
  }

  if (!firstName) {
    errors.firstName = 'Please enter the first name';
  }

  if (!lastName) {
    errors.lastName = 'Please enter the last name';
  }

  if (!(affiliation as Affiliation).name && !(affiliation as SuggestAffiliation).keyword) {
    // HACK
    (errors.affiliation as any) = 'Please enter the valid affiliation';
  }

  return errors;
};

const ResultContents: FC<{ onClose?: React.ReactEventHandler<{}> }> = ({ onClose }) => {
  return (
    <>
      <div className={s.description}>
        As we said before, we need time to make agreements with your affiliation. <br />
        We'll send you a email to manage your profile page right after agreements. <br />
        Once again, thank you for your request and it'll make better academic data.
      </div>
      <div className={s.buttonWrapper}>
        <Button elementType="button" variant="contained" color="blue" onClick={onClose}>
          <span>Okay</span>
        </Button>
      </div>
    </>
  );
};

interface RequestFormProps {
  initialValues: FormValues;
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
  userDevice: UserDevice;
  onClose?: React.ReactEventHandler<{}>;
}
const RequestForm: FC<RequestFormProps> = ({ initialValues, onSubmit, isLoading, onClose, userDevice }) => {
  return (
    <>
      <div className={s.description}>
        Claiming the ownership does <b>NOT</b> mean that you can immediately manage this page.
        <br />
        Currently, we <b>ONLY</b> allow this feature with affiliations that have agreements with us.
        <br />
        You request to us, we'll send you the status of agreements with your affiliation or the managing profile link.
      </div>
      <Formik initialValues={initialValues} onSubmit={onSubmit} validate={validateForm}>
        {({ errors, touched }) => {
          return (
            <Form>
              <div className={s.formRow}>
                <div className={s.formWrapper}>
                  <Field
                    labelText="First Name"
                    name="firstName"
                    placeholder="First Name"
                    component={FormikInput}
                    disabled={isLoading}
                  />
                  <Field
                    labelText="Last Name"
                    name="lastName"
                    placeholder="Last Name"
                    component={FormikInput}
                    style={{ marginLeft: '8px' }}
                    disabled={isLoading}
                  />
                </div>
                <div className={s.formWrapper}>
                  <Field
                    labelText="Email"
                    name="email"
                    placeholder="Email"
                    component={FormikInput}
                    disabled={isLoading}
                  />
                </div>
                <div className={s.affiliationFormWrapper}>
                  <label className={s.formLabel}>AFFILIATION</label>
                  <Field
                    name="affiliation"
                    component={AffiliationSelectBox}
                    format={formatAffiliation}
                    className={classNames({
                      [s.inputForm]: true,
                      [s.hasError]: !!errors.affiliation && !!touched.affiliation,
                    })}
                    errorWrapperClassName={s.affiliationErrorMsg}
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className={s.buttonWrapper}>
                <Button
                  elementType="button"
                  type="button"
                  variant="outlined"
                  color="gray"
                  onClick={onClose}
                  isLoading={isLoading}
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  type="submit"
                  elementType="button"
                  isLoading={isLoading}
                  fullWidth={userDevice === UserDevice.MOBILE}
                >
                  <Icon icon="SEND" />
                  <span>Request</span>
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

const RequestProfileFormDialog: FC<DialogProps & { authorId: string }> = ({ authorId, ...dialogProps }) => {
  useStyles(s);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const userDevice = useSelector<AppState, UserDevice>(state => state.layout.userDevice);

  const initialValues: FormValues = {
    firstName: '',
    lastName: '',
    affiliation: {
      id: null,
      name: '',
      nameAbbrev: null,
    },
    email: '',
  };

  const handleSubmit = async (values: FormValues) => {
    const { affiliation, email, firstName, lastName } = values;
    const aId = (affiliation as Affiliation).id || (affiliation as SuggestAffiliation).affiliationId;
    const aName = (affiliation as Affiliation).name || (affiliation as SuggestAffiliation).keyword;

    setIsLoading(true);
    try {
      await ProfileAPI.requestProfile({
        affiliation_id: aId || null,
        affiliation_name: aName || null,
        author_id: authorId,
        email,
        first_name: firstName,
        last_name: lastName,
      });
      setIsLoading(false);
      setIsEmailSent(true);
      Store.set(ProfileRequestKey, authorId);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  let title = null;
  let contents = null;
  if (isEmailSent) {
    title = <DialogTitle>Delivered your request</DialogTitle>;
    contents = <ResultContents onClose={dialogProps.onClose} />;
  } else {
    title = <DialogTitle>Claim ownership to this page</DialogTitle>;
    contents = (
      <RequestForm
        initialValues={initialValues}
        onSubmit={handleSubmit}
        onClose={dialogProps.onClose}
        isLoading={isLoading}
        userDevice={userDevice}
      />
    );
  }

  return (
    <Dialog fullScreen={userDevice === UserDevice.MOBILE} {...dialogProps}>
      {title}
      <DialogContent>{contents}</DialogContent>
    </Dialog>
  );
};

export default RequestProfileFormDialog;
