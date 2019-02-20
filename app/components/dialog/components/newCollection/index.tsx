import * as React from "react";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../../model/currentUser";
import { PostCollectionParams } from "../../../../api/collection";
import alertToast from "../../../../helpers/makePlutoToastAction";
import PlutoAxios from "../../../../api/pluto";
const styles = require("./newCollection.scss");
import * as Cookies from "js-cookie";
import { Collection } from "../../../../model/collection";
import GlobalDialogManager from "../../../../helpers/globalDialogManager/index";

interface NewCollectionDialogProps {
  currentUser: CurrentUser;
  myCollections: Collection[] | null;
  targetPaperId?: number;
  handleCloseDialogRequest: () => void;
  handleMakeCollection: (params: PostCollectionParams) => Promise<void>;
}

interface NewCollectionDialogStates {
  title: string;
  description: string;
}
const SELECTED_COLLECTION_ID = "selectedCollectionId";

@withStyles<typeof NewCollectionDialog>(styles)
class NewCollectionDialog extends React.PureComponent<NewCollectionDialogProps, NewCollectionDialogStates> {
  public constructor(props: NewCollectionDialogProps) {
    super(props);

    this.state = {
      title: "",
      description: "",
    };
  }

  public render() {
    const { handleCloseDialogRequest, myCollections } = this.props;
    const { title, description } = this.state;

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
                value={!myCollections || myCollections.length === 0 ? "Read Later" : title}
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
            <button onClick={this.makeCollection} className={styles.saveBtn}>
              Save
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
    const { handleMakeCollection, handleCloseDialogRequest, myCollections, targetPaperId } = this.props;
    const { title, description } = this.state;

    try {
      await handleMakeCollection({ title, description });

      Cookies.set(SELECTED_COLLECTION_ID, "0");
      handleCloseDialogRequest();
      if (targetPaperId && (!myCollections || myCollections.length === 0)) {
        GlobalDialogManager.openCollectionDialog(targetPaperId);
      }
    } catch (err) {
      const error = PlutoAxios.getGlobalError(err);
      alertToast({
        type: "error",
        message: error.message,
      });
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
export default NewCollectionDialog;
