import * as React from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { denormalize } from 'normalizr';
import Dialog from '@material-ui/core/Dialog';
import { AppState } from '../../reducers';
import * as Actions from './actions';
import SignIn from '../auth/signIn';
import SignUp from '../auth/signUp';
import ResetPassword from '../auth/resetPasswordDialog';
import VerificationNeeded from '../auth/verificationNeeded';
import CollectionDialog from './components/collection';
import NewCollectionDialog from './components/newCollection';
import EditCollectionDialog from './components/editCollection';
import AllPublicationsDialog from './components/allPublications';
import { resendVerificationEmail } from '../auth/emailVerification/actions';
import { DialogContainerProps } from './types';
import { withStyles } from '../../helpers/withStylesHelper';
import { GLOBAL_DIALOG_TYPE } from './reducer';
import { collectionSchema } from '../../model/collection';
import {
  PostCollectionParams,
  AddPaperToCollectionParams,
  RemovePapersFromCollectionParams,
  UpdateCollectionParams,
} from '../../api/collection';
import CitationBox from '../paperShow/components/citationBox';
import { AvailableCitationType } from '../../containers/paperShow/records';
import AuthorListDialog from '../authorListDialog';
import alertToast from '../../helpers/makePlutoToastAction';
import FinalSignUpContent from '../auth/signUp/components/finalSignUpContent';
import EnvChecker from '../../helpers/envChecker';
import SurveyForm from '../auth/signUp/components/surveyForm';
import PaperFigureDetail from '../common/paperFigureDetail/paperFigureDetail';
import { UserDevice } from '../layouts/reducer';
const styles = require('./dialog.scss');

function mapStateToProps(state: AppState) {
  return {
    layout: state.layout,
    dialogState: state.dialog,
    currentUser: state.currentUser,
    myCollections: denormalize(state.dialog.myCollectionIds, [collectionSchema], state.entities),
  };
}

@withStyles<typeof DialogComponent>(styles)
class DialogComponent extends React.PureComponent<DialogContainerProps, {}> {
  private cancelToken = Axios.CancelToken.source();

  public componentWillUnmount() {
    this.cancelToken.cancel();
  }

  public render() {
    const { layout, dialogState, currentUser, myCollections } = this.props;

    if (dialogState.type === GLOBAL_DIALOG_TYPE.COLLECTION && dialogState.collectionDialogTargetPaperId) {
      return (
        <Dialog
          open={dialogState.isOpen}
          onClose={this.closeCollectionDialog}
          classes={{ paper: styles.dialogPaper }}
          maxWidth={'lg'}
        >
          <CollectionDialog
            currentUser={currentUser}
            myCollections={myCollections}
            handleCloseDialogRequest={this.closeCollectionDialog}
            getMyCollections={this.getMyCollections}
            handleSubmitNewCollection={this.handleSubmitNewCollection}
            handleRemovingPaperFromCollection={this.handleRemovingPaperFromCollection}
            handleAddingPaperToCollections={this.handleAddingPaperToCollection}
            collectionDialogPaperId={dialogState.collectionDialogTargetPaperId}
          />
        </Dialog>
      );
    }

    if (dialogState.type === GLOBAL_DIALOG_TYPE.CITATION && !!dialogState.citationPaperId) {
      return (
        <Dialog
          open={dialogState.isOpen}
          onClose={this.closeCitationDialog}
          classes={{ paper: styles.dialogPaper }}
          maxWidth={'lg'}
        >
          <CitationBox
            paperId={dialogState.citationPaperId}
            activeTab={dialogState.activeCitationTab}
            isLoading={dialogState.isLoadingCitationText}
            citationText={dialogState.citationText}
            closeCitationDialog={this.closeCitationDialog}
            handleClickCitationTab={this.handleClickCitationTab}
            fetchCitationText={this.fetchCitationText}
          />
        </Dialog>
      );
    }

    if (dialogState.type === GLOBAL_DIALOG_TYPE.PAPER_FIGURE_DETAIL) {
      return (
        <Dialog
          open={dialogState.isOpen}
          onClose={() => this.closeDialog()}
          classes={{
            paper:
              layout.userDevice !== UserDevice.DESKTOP ? styles.mobileFigureDetailDialog : styles.figureDetailDialog,
          }}
          maxWidth={'lg'}
        >
          <PaperFigureDetail handleCloseDialogRequest={this.closeDialog} />
        </Dialog>
      );
    }

    return (
      <Dialog
        open={dialogState.isOpen}
        onClose={() => {
          if (!dialogState.isBlocked) {
            this.closeDialog();
          }
        }}
        classes={{
          paper: styles.dialogPaper,
        }}
        maxWidth={'lg'}
      >
        {this.getDialogContent(dialogState.type) || ''}
      </Dialog>
    );
  }

  private closeCollectionDialog = () => {
    this.closeDialog();
  };

  private closeCitationDialog = () => {
    this.closeDialog();
  };

  private closeDialog = () => {
    const { dispatch } = this.props;
    dispatch(Actions.closeDialog());
  };

  private changeDialogType = (type: GLOBAL_DIALOG_TYPE) => {
    const { dispatch } = this.props;
    dispatch(Actions.changeDialogType(type));
  };

  private resendVerificationEmail = () => {
    const { dispatch, currentUser } = this.props;
    if (currentUser && currentUser.isLoggedIn) {
      dispatch(resendVerificationEmail(currentUser.email, true));
    }
  };

  private getMyCollections = () => {
    const { dispatch, currentUser, dialogState } = this.props;

    if (
      currentUser &&
      currentUser.isLoggedIn &&
      dialogState.collectionDialogTargetPaperId &&
      (currentUser.oauthLoggedIn || currentUser.emailVerified)
    ) {
      dispatch(Actions.getMyCollections(dialogState.collectionDialogTargetPaperId, this.cancelToken.token));
    }
  };

  private handleAddingPaperToCollection = async (params: AddPaperToCollectionParams) => {
    const { dispatch } = this.props;

    try {
      await dispatch(Actions.addPaperToCollection(params));
    } catch (err) {
      alertToast({
        type: 'error',
        message: err.message,
      });
    } finally {
      this.getMyCollections();
    }
  };

  private handleRemovingPaperFromCollection = async (params: RemovePapersFromCollectionParams) => {
    const { dispatch } = this.props;

    try {
      await dispatch(Actions.removePaperFromCollection(params));
    } catch (err) {
      alertToast({
        type: 'error',
        message: err.message,
      });
    } finally {
      this.getMyCollections();
    }
  };

  private validateCollection = (params: PostCollectionParams | UpdateCollectionParams) => {
    const { title } = params;

    if (title.length === 0) {
      throw new Error('Collection name should be more than 1 characters.');
    } else if (title.length > 100) {
      throw new Error('Collection name should be less than 100 characters.');
    }
  };

  private handleSubmitNewCollection = async (params: PostCollectionParams, targetPaperId?: number) => {
    const { dispatch } = this.props;

    this.validateCollection(params);

    await dispatch(Actions.postNewCollection(params, targetPaperId));
  };

  private handleDeleteCollection = async (collectionId: number) => {
    const { dispatch, currentUser, history } = this.props;

    try {
      await dispatch(Actions.deleteCollection(collectionId));
      history.push(`/users/${currentUser.id}/collections`);
    } catch (err) {
      alertToast({
        type: 'error',
        message: err.message,
      });
    }
  };

  private handleUpdateCollection = async (params: UpdateCollectionParams) => {
    const { dispatch } = this.props;

    try {
      this.validateCollection(params);
      await dispatch(Actions.updateCollection(params));
    } catch (err) {
      alertToast({
        type: 'error',
        message: `Failed to update collection. ${err.message}`,
      });
    }
  };

  private fetchCitationText = () => {
    const { dispatch, dialogState } = this.props;

    if (dialogState.citationPaperId) {
      dispatch(
        Actions.getCitationText({
          type: dialogState.activeCitationTab,
          paperId: dialogState.citationPaperId,
        })
      );
    }
  };

  private handleClickCitationTab = (tab: AvailableCitationType) => {
    const { dialogState, dispatch } = this.props;

    if (dialogState.citationPaperId) {
      dispatch(
        Actions.getCitationText({
          type: tab,
          paperId: dialogState.citationPaperId,
        })
      );
      dispatch(Actions.changeCitationTab(tab));
    }
  };

  private getDialogContent = (type: GLOBAL_DIALOG_TYPE | null) => {
    const { currentUser, dialogState, dispatch } = this.props;

    switch (type) {
      case GLOBAL_DIALOG_TYPE.SIGN_IN:
        return <SignIn handleChangeDialogType={this.changeDialogType} userActionType={dialogState.userActionType} />;

      case GLOBAL_DIALOG_TYPE.SIGN_UP:
        return <SignUp handleChangeDialogType={this.changeDialogType} userActionType={dialogState.userActionType} />;

      case GLOBAL_DIALOG_TYPE.ADD_PUBLICATIONS_TO_AUTHOR_DIALOG: {
        return <AllPublicationsDialog />;
      }

      case GLOBAL_DIALOG_TYPE.SURVEY_FORM: {
        return <SurveyForm />;
      }

      case GLOBAL_DIALOG_TYPE.FINAL_SIGN_UP_WITH_EMAIL: {
        return <FinalSignUpContent onSubmit={this.closeDialog} contentType="email" email={currentUser.email} />;
      }

      case GLOBAL_DIALOG_TYPE.FINAL_SIGN_UP_WITH_SOCIAL: {
        return (
          <FinalSignUpContent
            onSubmit={() => {
              if (!EnvChecker.isOnServer() && dialogState.oauthResult && dialogState.oauthResult.vendor === 'ORCID') {
                window.close();
              }
              dispatch(Actions.closeDialog());
            }}
            contentType="social"
          />
        );
      }

      case GLOBAL_DIALOG_TYPE.VERIFICATION_NEEDED:
        if (currentUser.isLoggedIn) {
          return <VerificationNeeded email={currentUser.email} resendEmailFunc={this.resendVerificationEmail} />;
        }
        return null;

      case GLOBAL_DIALOG_TYPE.RESET_PASSWORD:
        return <ResetPassword handleCloseDialogRequest={this.closeDialog} />;

      case GLOBAL_DIALOG_TYPE.NEW_COLLECTION:
        return (
          <NewCollectionDialog
            handleCloseDialogRequest={this.closeDialog}
            targetPaperId={dialogState.collectionDialogTargetPaperId}
            handleMakeCollection={this.handleSubmitNewCollection}
            handleAddingPaperToCollections={this.handleAddingPaperToCollection}
          />
        );
      case GLOBAL_DIALOG_TYPE.EDIT_COLLECTION:
        if (dialogState.collection) {
          return (
            <EditCollectionDialog
              handleCloseDialogRequest={this.closeDialog}
              currentUser={currentUser}
              handleDeleteCollection={this.handleDeleteCollection}
              handleUpdateCollection={this.handleUpdateCollection}
              collection={dialogState.collection}
            />
          );
        }
        return null;

      case GLOBAL_DIALOG_TYPE.AUTHOR_LIST_DIALOG:
        if (dialogState.authorListTargetPaper) {
          return (
            <AuthorListDialog paper={dialogState.authorListTargetPaper} handleCloseDialogRequest={this.closeDialog} />
          );
        }
        return null;

      default:
        return null;
    }
  };
}
export default withRouter(connect(mapStateToProps)(DialogComponent));
