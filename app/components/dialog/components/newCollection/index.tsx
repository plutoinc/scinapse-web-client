import * as React from "react";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../../model/currentUser";
import { PostCollectionParams, AddPaperToCollectionParams } from "../../../../api/collection";
import alertToast from "../../../../helpers/makePlutoToastAction";
import PlutoAxios from "../../../../api/pluto";
const styles = require("./newCollection.scss");
import * as Cookies from "js-cookie";
import { AppState } from "../../../../reducers";
import { connect } from "react-redux";
import { UserCollectionsState } from "../../../collections/reducer";
import CircularProgress from "@material-ui/core/CircularProgress";

interface NewCollectionDialogProps {
  currentUser: CurrentUser;
  userCollections: UserCollectionsState;
  targetPaperId?: number;
  handleCloseDialogRequest: () => void;
  handleAddingPaperToCollections: (params: AddPaperToCollectionParams) => Promise<void>;
  handleMakeCollection: (params: PostCollectionParams, targetPaperId?: number) => Promise<void>;
}

interface NewCollectionDialogStates {
  title: string;
  description: string;
  isLoading: boolean;
}
const SELECTED_COLLECTION_ID = "selectedCollectionId";

@withStyles<typeof NewCollectionDialog>(styles)
class NewCollectionDialog extends React.PureComponent<NewCollectionDialogProps, NewCollectionDialogStates> {
  public constructor(props: NewCollectionDialogProps) {
    super(props);

    this.state = {
      title: !props.userCollections || props.userCollections.collectionIds.length === 0 ? "Read Later" : "",
      description: "",
      isLoading: false,
    };
  }

  public render() {
    const { handleCloseDialogRequest } = this.props;
    const { title, description, isLoading } = this.state;

    return (
      <div className={styles.dialogWrapper}>
        <div className={styles.header}>New collection</div>
        <div className={styles.contentWrapper}>
          <div className={styles.editForm}>
            <div className={styles.formControl}>
              <label>
                <span className={styles.labelText}>Name</span>
                <span className={styles.textCounter}>{`${title.length} / 100`}</span>
              </label>
              <input
                value={title}
                autoFocus
                onChange={this.handleTitleChange}
                onKeyPress={this.handleKeyPressName}
                placeholder="Enter Collection Name"
                type="text"
              />
            </div>
            <div className={styles.formControl}>
              <label>
                <span className={styles.labelText}>Description (Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={this.handleDescriptionChange}
                placeholder="Enter Collection Description"
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.rightBox}>
            <button onClick={handleCloseDialogRequest} className={styles.cancelBtn}>
              Cancel
            </button>
            <button onClick={this.makeCollection} className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? <CircularProgress color="inherit" disableShrink={true} size={14} thickness={4} /> : `Create`}
            </button>
          </div>
        </div>
      </div>
    );
  }
  private handleKeyPressName = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await this.makeCollection();
    }
  };

  private makeCollection = async () => {
    const { handleMakeCollection, handleCloseDialogRequest, userCollections, targetPaperId } = this.props;
    const { title, description } = this.state;

    this.setState(prevState => ({ ...prevState, isLoading: true }));

    try {
      if (targetPaperId && userCollections.collectionIds.length === 0) {
        await handleMakeCollection({ title, description }, targetPaperId);
      } else {
        await handleMakeCollection({ title, description });
      }

      Cookies.set(SELECTED_COLLECTION_ID, "0");

      handleCloseDialogRequest();
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
      this.setState(prevState => ({ ...prevState, isLoading: false }));
    }
  };

  private handleTitleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;

    this.setState({
      title: text,
    });
  };

  private handleDescriptionChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const text = e.currentTarget.value;

    this.setState({
      description: text,
    });
  };
}

function mapStateToProps(state: AppState) {
  return {
    userCollections: state.userCollections,
    currentUser: state.currentUser,
  };
}

export default connect(mapStateToProps)(NewCollectionDialog);
