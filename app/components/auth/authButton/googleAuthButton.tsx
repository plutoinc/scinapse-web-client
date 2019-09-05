import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { OAuthCheckParams } from '../../../api/types/auth';
import AuthAPI from '../../../api/auth';
import Icon from '../../../icons';
import { signInWithSocial } from '../signIn/actions';
import { closeDialog } from '../../dialog/actions';
import { AppState } from '../../../reducers';
import { DialogState } from '../../dialog/reducer';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Button from '../../common/button/button';

declare var gapi: any;

interface AuthButtonProps {
  dispatch: Dispatch<any>;
  dialogState: DialogState;
  isLoading: boolean;
  onSignUpWithSocial: (values: OAuthCheckParams) => void;
}

const AuthButton: React.FunctionComponent<AuthButtonProps> = props => {
  const { dispatch, onSignUpWithSocial, dialogState, isLoading } = props;
  const [gapiIsLoading, setGapiIsLoading] = React.useState(typeof gapi === 'undefined');
  const buttonEl = React.useRef<HTMLDivElement | null>(null);
  let auth2: any;

  React.useEffect(
    () => {
      if (typeof gapi !== 'undefined') {
        setGapiIsLoading(false);
      }
    },
    [typeof gapi]
  );

  React.useEffect(
    () => {
      if (buttonEl.current && typeof gapi !== 'undefined') {
        gapi.load('auth2', () => {
          auth2 = gapi.auth2.init({
            client_id: '304104926631-429jkjmqj2lgme52067ecm5fk30iqpjr.apps.googleusercontent.com',
            cookiepolicy: 'single_host_origin',
          });
          attachSignIn(buttonEl.current);
        });

        function attachSignIn(element: any) {
          auth2.attachClickHandler(
            element,
            {},
            async (res: any) => {
              const idToken = res.getAuthResponse().id_token;
              const status = await AuthAPI.checkOAuthStatus('GOOGLE', idToken);

              if (status.isConnected) {
                await dispatch(signInWithSocial('GOOGLE', idToken));
                const authContext = dialogState.authContext;
                if (authContext) {
                  let actionLabel: string | null = authContext.expName || authContext.actionLabel;

                  if (!actionLabel) {
                    actionLabel = 'topBar';
                  }

                  ActionTicketManager.trackTicket({
                    pageType: authContext.pageType,
                    actionType: 'fire',
                    actionArea: authContext.actionArea,
                    actionTag: 'signIn',
                    actionLabel,
                    expName: authContext.expName,
                  });
                }
                dispatch(closeDialog());
              } else {
                onSignUpWithSocial &&
                  onSignUpWithSocial({
                    email: status.email,
                    firstName: status.firstName,
                    lastName: status.lastName,
                    token: idToken,
                    vendor: 'GOOGLE',
                  });
              }
            },
            (error: Error) => {
              console.error(`GOOGLE_AUTH_ERROR : ${JSON.stringify(error)}`);
            }
          );
        }
      }
    },
    [buttonEl.current, typeof gapi]
  );

  return (
    <div ref={buttonEl}>
      <Button
        size="large"
        elementType="button"
        style={{ backgroundColor: '#dc5240' }}
        disabled={gapiIsLoading}
        isLoading={isLoading}
        fullWidth
      >
        <Icon icon="GOOGLE_LOGO" />
        <span>Continue with Google</span>
      </Button>
    </div>
  );
};

function mapStateToProps(state: AppState) {
  return {
    dialogState: state.dialog,
  };
}

export default connect(mapStateToProps)(AuthButton);
