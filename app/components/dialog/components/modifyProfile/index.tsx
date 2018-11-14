import * as React from "react";
import { InjectedFormProps, reduxForm, Field } from "redux-form";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { Author } from "../../../../model/author/author";
import ScinapseButton from "../../../common/scinapseButton";
import Icon from "../../../../icons";
import ScinapseReduxInput from "../../../common/scinapseInput/scinapseReduxInput";
import ReduxAutoSizeTextarea from "../../../common/autoSizeTextarea/reduxAutoSizeTextarea";
const styles = require("./modifyProfile.scss");

interface FormState {
  authorName: string;
  currentAffiliation: string;
  bio: string;
  email: string;
  website: string;
}

interface ModifyProfileProps {
  author: Author;
  isOpen: boolean;
  handleClose: React.ReactEventHandler<{}>;
}

interface ModifyProfileState {
  isLoading: boolean;
}

@withStyles<typeof ModifyProfileDialog>(styles)
class ModifyProfileDialog extends React.PureComponent<
  ModifyProfileProps & InjectedFormProps<FormState, ModifyProfileProps>,
  ModifyProfileState
> {
  public constructor(props: ModifyProfileProps & InjectedFormProps<FormState, ModifyProfileProps>) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  public render() {
    const { isOpen, handleClose, handleSubmit } = this.props;
    const { isLoading } = this.state;

    console.log(this.props);

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        classes={{
          paper: styles.dialogPaper,
        }}
      >
        <div className={styles.dialogHeader}>
          <div>Edit auhtor information</div>
          <div className={styles.closeButton} onClick={handleClose}>
            <Icon className={styles.closeIcon} icon="X_BUTTON" />
          </div>
        </div>
        <div className={styles.subtitle}>You can edit the Author information that will be shown to other users.</div>
        <div className={styles.contentSection}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formControl}>
              <div className={styles.inlineInput}>
                <label htmlFor="authorName">Author Name</label>
                <Field
                  inputClassName={styles.inputField}
                  name="authorName"
                  component={ScinapseReduxInput}
                  type="text"
                  placeholder="Author Name"
                />
              </div>
              <div className={styles.inlineInput}>
                <label htmlFor="currentAffiliation">Current Affiliation</label>
                <Field
                  name="currentAffiliation"
                  component={ScinapseReduxInput}
                  type="text"
                  inputClassName={styles.inputField}
                  placeholder="Current Affiliation"
                />
              </div>
            </div>
            <div className={styles.bioWrapper}>
              <label htmlFor="bio">Short Bio</label>
              <Field
                name="bio"
                component={ReduxAutoSizeTextarea}
                type="text"
                textareaClassName={styles.textAreaWrapper}
                textareaStyle={{ padding: "8px" }}
                placeholder="Please tell us about yourself."
              />
            </div>
            <div className={styles.formControl}>
              <div className={styles.inlineInput}>
                <label htmlFor="email">Email Address</label>
                <Field
                  inputClassName={styles.inputField}
                  name="email"
                  component={ScinapseReduxInput}
                  type="text"
                  placeholder="Email Address"
                />
              </div>
              <div className={styles.inlineInput}>
                <label htmlFor="website">Website URL</label>
                <Field
                  inputClassName={styles.inputField}
                  name="website"
                  component={ScinapseReduxInput}
                  type="text"
                  placeholder="e.g. https://username.com"
                />
              </div>
            </div>
          </form>
        </div>
        <div className={styles.footer}>
          <div className={styles.buttonsWrapper}>
            <ScinapseButton
              style={{
                backgroundColor: isLoading ? "#ecf1fa" : "#6096ff",
                cursor: isLoading ? "not-allowed" : "pointer",
                width: "127px",
                height: "40px",
              }}
              disabled={isLoading}
              gaCategory="EditProfile"
              content="Save Changes"
              onClick={() => {
                console.log("CLICK");
              }}
            />
          </div>
        </div>
      </Dialog>
    );
  }
}
export default reduxForm<FormState, ModifyProfileProps>({
  form: "modifyProfile",
})(ModifyProfileDialog);
