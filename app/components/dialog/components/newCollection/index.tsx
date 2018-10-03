import * as React from "react";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { CurrentUser } from "../../../../model/currentUser";
import { PostCollectionParams } from "../../../../api/collection";
import alertToast from "../../../../helpers/makePlutoToastAction";
const styles = require("./newCollection.scss");

interface NewCollectionDialogProps {
  currentUser: CurrentUser;
  handleCloseDialogRequest: () => void;
  handleMakeCollection: (params: PostCollectionParams) => Promise<void>;
}

interface NewCollectionDialogStates {
  title: string;
  description: string;
}

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
    const { handleCloseDialogRequest } = this.props;
    const { title, description } = this.state;

    return (
      <div className={styles.dialogWrapper}>
        <div className={styles.header}>New collection</div>
        <div className={styles.contentWrapper}>
          <div className={styles.editForm}>
            <div className={styles.formControl}>
              <label>Name</label>
              <input value={title} onChange={this.handleTitleChange} placeholder="Collection Name" type="text" />
            </div>
            <div className={styles.formControl}>
              <label>Description(optional)</label>
              <textarea
                value={description}
                onChange={this.handleDescriptionChange}
                placeholder="Collection Description"
              />
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.rightBox}>
            <button onClick={handleCloseDialogRequest} className={styles.cancelBtn}>
              Cancel
            </button>
            <button onClick={this.handleClickSaveBtn} className={styles.saveBtn}>
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  private handleClickSaveBtn = async () => {
    const { handleMakeCollection, handleCloseDialogRequest } = this.props;
    const { title, description } = this.state;

    try {
      await handleMakeCollection({ title, description });
      handleCloseDialogRequest();
    } catch (err) {
      alertToast({
        type: "error",
        message: err.message,
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
