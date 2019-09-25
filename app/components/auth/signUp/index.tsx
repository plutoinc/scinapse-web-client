import * as React from 'react';
import { Dispatch } from 'redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as Actions from './actions';
import { SIGN_UP_STEP } from './types';
import { withStyles } from '../../../helpers/withStylesHelper';
import FirstForm from './components/firstForm';
import SignUpForm, { SignUpFormValues } from './components/signUpForm';
import { OAUTH_VENDOR, SignUpWithSocialParams } from '../../../api/types/auth';
import { AppState } from '../../../reducers';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import GlobalDialogManager from '../../../helpers/globalDialogManager';
import { ActionCreators } from '../../../actions/actionTypes';
import { GLOBAL_DIALOG_TYPE } from '../../dialog/reducer';
const styles = require('./signUp.scss');

type SignUpContainerProps = RouteComponentProps<SignUpSearchParams> &
  ReturnType<typeof mapStateToProps> & {
    dispatch: Dispatch<any>;
    handleChangeDialogType: (type: GLOBAL_DIALOG_TYPE) => void;
    userActionType: Scinapse.ActionTicket.ActionTagType | undefined;
  };

interface SignUpSearchParams {
  code?: string;
  vendor?: OAUTH_VENDOR;
}

const SignUp: React.FunctionComponent<SignUpContainerProps> = props => {
  const { dialogState, dispatch, signUpModalState } = props;
  const [signUpStep, setSignUpStep] = React.useState(dialogState.signUpStep || SIGN_UP_STEP.FIRST);
  const [email, setEmail] = React.useState(dialogState.oauthResult ? dialogState.oauthResult.email || '' : '');
  const [password, setPassword] = React.useState('');
  const [firstName, setFirstName] = React.useState(dialogState.oauthResult ? dialogState.oauthResult.firstName : '');
  const [lastName, setLastName] = React.useState(dialogState.oauthResult ? dialogState.oauthResult.lastName : '');
  const [token, setToken] = React.useState({
    token: dialogState.oauthResult ? dialogState.oauthResult.token : '',
    vendor: dialogState.oauthResult ? dialogState.oauthResult.vendor : '',
  });
  const authContext = dialogState.authContext;

  React.useEffect(
    () => {
      if (signUpStep === SIGN_UP_STEP.WITH_SOCIAL || signUpStep === SIGN_UP_STEP.WITH_EMAIL) {
        dispatch(ActionCreators.setBlockedGlobalDialog());
      }
    },
    [signUpStep]
  );

  function trackClickSignUpAtFormStep(vendor?: OAUTH_VENDOR) {
    if (authContext) {
      ActionTicketManager.trackTicket({
        pageType: authContext.pageType,
        actionType: 'fire',
        actionArea: authContext.actionArea,
        actionTag: 'clickSignUpAtStep2',
        actionLabel: vendor || 'email',
        expName: authContext.expName,
      });
    }
  }

  async function handleSubmitSignUpWithEmail(values: SignUpFormValues) {
    await props.dispatch(Actions.signUpWithEmail(values));

    if (authContext) {
      let actionLabel: string | null = authContext.expName || authContext.actionLabel;

      if (!actionLabel) {
        actionLabel = 'topBar';
      }

      ActionTicketManager.trackTicket({
        pageType: authContext.pageType,
        actionType: 'fire',
        actionArea: authContext.actionArea,
        actionTag: 'signUp',
        actionLabel,
        expName: authContext.expName,
      });
    }
  }

  async function handleSubmitSignUpWithSocial(values: SignUpFormValues) {
    const { firstName, lastName, affiliation } = values;

    const params: SignUpWithSocialParams = {
      email: values.email,
      firstName,
      lastName,
      affiliation,
      profileLink: values.profileLink,
      token: {
        vendor: token.vendor as OAUTH_VENDOR,
        token: token.token,
      },
    };

    try {
      await props.dispatch(Actions.signUpWithSocial(params));
      if (authContext) {
        let actionLabel: string | null = authContext.expName || authContext.actionLabel;

        if (!actionLabel) {
          actionLabel = 'topBar';
        }

        ActionTicketManager.trackTicket({
          pageType: authContext.pageType,
          actionType: 'fire',
          actionArea: authContext.actionArea,
          actionTag: 'signUp',
          actionLabel,
          expName: authContext.expName,
        });
      } else if (params.token.vendor === 'ORCID') {
        ActionTicketManager.trackTicket({
          pageType: 'home',
          actionType: 'fire',
          actionArea: 'unknown',
          actionTag: 'signUp',
          actionLabel: 'ORCID',
          expName: '',
        });
      }
    } catch (err) {
      console.error(err);
      setSignUpStep(SIGN_UP_STEP.FIRST);
      throw err;
    }
  }

  switch (signUpStep) {
    case SIGN_UP_STEP.WITH_EMAIL:
      return (
        <SignUpForm
          onSubmit={handleSubmitSignUpWithEmail}
          onClickNext={() => {
            trackClickSignUpAtFormStep();
          }}
          onSucceed={() => {
            setSignUpStep(SIGN_UP_STEP.SURVEY);
          }}
          onClickBack={() => {
            dispatch(ActionCreators.unsetBlockedGlobalDialog());
            setSignUpStep(SIGN_UP_STEP.FIRST);
          }}
          withSocial={false}
          email={email}
          password={password}
          firstName=""
          lastName=""
          onClickTab={props.handleChangeDialogType}
        />
      );

    case SIGN_UP_STEP.WITH_SOCIAL:
      return (
        <SignUpForm
          onClickNext={() => {
            trackClickSignUpAtFormStep(token.vendor as OAUTH_VENDOR);
          }}
          onSubmit={handleSubmitSignUpWithSocial}
          onSucceed={() => {
            setSignUpStep(SIGN_UP_STEP.SURVEY);
          }}
          onClickBack={() => {
            dispatch(ActionCreators.unsetBlockedGlobalDialog());
            setSignUpStep(SIGN_UP_STEP.FIRST);
          }}
          withSocial={true}
          email={email}
          password={password}
          firstName={firstName}
          lastName={lastName}
          onClickTab={props.handleChangeDialogType}
        />
      );

    case SIGN_UP_STEP.SURVEY:
      GlobalDialogManager.openSurveyFormDialog(token.vendor !== '' ? token.vendor : undefined);
      return null;

    case SIGN_UP_STEP.FINAL_WITH_EMAIL:
      GlobalDialogManager.openFinalSignUpWithEmailDialog();
      return null;

    case SIGN_UP_STEP.FINAL_WITH_SOCIAL:
      GlobalDialogManager.openFinalSignUpWithSocialDialog();
      return null;

    default:
      return (
        <FirstForm
          initialEmail={signUpModalState.email}
          onSubmit={values => {
            setEmail(values.email);
            setPassword(values.password);
            setSignUpStep(SIGN_UP_STEP.WITH_EMAIL);
            if (authContext) {
              ActionTicketManager.trackTicket({
                pageType: authContext.pageType,
                actionType: 'fire',
                actionArea: authContext.actionArea,
                actionTag: 'clickSignUpAtFirstForm',
                actionLabel: 'email',
                expName: authContext.expName,
              });
            }
          }}
          onSignUpWithSocial={(values: {
            email?: string | null;
            firstName: string;
            lastName: string;
            vendor: OAUTH_VENDOR;
            token: string;
          }) => {
            setEmail(values.email || '');
            setFirstName(values.firstName || '');
            setLastName(values.lastName || '');
            setToken({
              token: values.token,
              vendor: values.vendor,
            });
            setSignUpStep(SIGN_UP_STEP.WITH_SOCIAL);
            if (authContext) {
              ActionTicketManager.trackTicket({
                pageType: authContext.pageType,
                actionType: 'fire',
                actionArea: authContext.actionArea,
                actionTag: 'clickSignUpAtFirstForm',
                actionLabel: values.vendor,
                expName: authContext.expName,
              });
            }
          }}
          onClickTab={props.handleChangeDialogType}
          userActionType={props.userActionType}
        />
      );
  }
};

function mapStateToProps(state: AppState) {
  return {
    dialogState: state.dialog,
    signUpModalState: state.signUpModalState,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles<typeof SignUp>(styles)(SignUp)));
