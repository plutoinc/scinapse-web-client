import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Formik, Field, FormikErrors, ErrorMessage, FormikProps } from "formik";
import { withStyles } from "../../../../helpers/withStylesHelper";
import { Author } from "../../../../model/author/author";
import ScinapseButton from "../../../common/scinapseButton";
import Icon from "../../../../icons";
import ScinapseFormikInput from "../../../common/scinapseInput/scinapseFormikInput";
import ReduxAutoSizeTextarea from "../../../common/autoSizeTextarea/reduxAutoSizeTextarea";
import AffiliationSelectBox from "./affiliationSelectBox/index";
import { Affiliation } from "../../../../model/affiliation";
import { SuggestAffiliation } from "../../../../api/suggest";
import validateEmail from "../../../../helpers/validateEmail";
const styles = require("./modifyProfile.scss");

export interface ModifyProfileFormState {
  authorName: string;
  currentAffiliation: Affiliation | SuggestAffiliation | string;
  bio: string;
  email: string;
  website: string;
}

interface ModifyProfileProps {
  author: Author;
  isOpen: boolean;
  isLoading: boolean;
  initialValues: ModifyProfileFormState;
  handleSubmitForm: (profile: ModifyProfileFormState) => Promise<void>;
  handleClose: React.ReactEventHandler<{}>;
}

const validateForm = (values: ModifyProfileFormState) => {
  const errors: FormikErrors<ModifyProfileFormState> = {};

  if (!validateEmail(values.email)) {
    errors.email = "Please enter valid e-mail address.";
  }

  if (
    !(values.currentAffiliation as Affiliation).id &&
    !(values.currentAffiliation as SuggestAffiliation).affiliation_id &&
    values.currentAffiliation !== null
  ) {
    errors.currentAffiliation = "Not available affiliation";
  }

  if (!values.authorName && values.authorName.length < 2) {
    errors.authorName = "Minimum length is 1";
  }

  if (values.website.length > 0 && !values.website.includes("http://") && !values.website.includes("https://")) {
    errors.website = "Website URL should start with 'http://' or 'https://'";
  }

  return errors;
};

@withStyles<typeof ModifyProfileDialog>(styles)
class ModifyProfileDialog extends React.PureComponent<ModifyProfileProps> {
  private formikNode: Formik<ModifyProfileFormState> | null;
  public constructor(props: ModifyProfileProps) {
    super(props);

    this.state = {
      isLoading: false,
    };
  }

  public componentWillReceiveProps(nextProps: ModifyProfileProps) {
    if (!this.props.isOpen && nextProps.isOpen && this.formikNode) {
      this.formikNode.resetForm();
    }
  }

  public render() {
    const { author, isOpen, handleClose, isLoading, handleSubmitForm, initialValues } = this.props;

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        classes={{
          paper: styles.dialogPaper,
        }}
      >
        <div className={styles.dialogHeader}>
          <div className={styles.mainTitle}>
            {author.isLayered ? "Edit author information" : "Check and fill your information"}
          </div>
          <div className={styles.closeButton} onClick={handleClose}>
            <Icon className={styles.closeIcon} icon="X_BUTTON" />
          </div>
          <div className={styles.subtitle}>You can edit the Author information that will be shown to other users.</div>
        </div>
        <Formik
          ref={(el: any) => (this.formikNode = el)}
          initialValues={initialValues}
          onSubmit={handleSubmitForm}
          validate={validateForm}
          enableReinitialize={true}
          render={({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <div className={styles.contentSection}>
                  <div className={styles.formControl}>
                    <div className={styles.inlineInput}>
                      <label htmlFor="authorName">Author Name</label>
                      <Field
                        name="authorName"
                        type="text"
                        placeholder="Author Name"
                        component={ScinapseFormikInput}
                        inputClassName={styles.inputField}
                      />
                      <ErrorMessage name="authorName" className={styles.errorMessage} component="div" />
                    </div>
                    <div className={styles.inlineInput} style={{ width: "100%" }}>
                      <label htmlFor="currentAffiliation">Current Affiliation</label>
                      <Field
                        name="currentAffiliation"
                        component={AffiliationSelectBox}
                        inputClassName={styles.inputField}
                        format={this.formatAffiliation}
                      />
                    </div>
                  </div>
                  <div className={styles.bioWrapper}>
                    <label htmlFor="bio">
                      Short Bio<small> (Optional)</small>
                    </label>
                    <Field
                      name="bio"
                      component={ReduxAutoSizeTextarea}
                      disabled={false}
                      textareaClassName={styles.textAreaWrapper}
                      textareaStyle={{ padding: "8px" }}
                      placeholder="Please tell us about yourself."
                    />
                  </div>
                  <div className={styles.formControl}>
                    <div className={styles.inlineInput}>
                      <label htmlFor="email">Email Address</label>
                      <Field
                        component={ScinapseFormikInput}
                        inputClassName={styles.inputField}
                        name="email"
                        type="email"
                        placeholder="Email Address"
                      />
                      <ErrorMessage name="email" className={styles.errorMessage} component="div" />
                    </div>
                    <div className={styles.inlineInput}>
                      <label htmlFor="website">
                        Website URL<small> (Optional)</small>
                      </label>
                      <Field
                        component={ScinapseFormikInput}
                        inputClassName={styles.inputField}
                        name="website"
                        type="text"
                        placeholder="e.g. https://username.com"
                      />
                      <ErrorMessage name="website" className={styles.errorMessage} component="div" />
                    </div>
                  </div>
                </div>
                <div className={styles.footer}>
                  <div className={styles.buttonsWrapper}>
                    <ScinapseButton
                      type="submit"
                      style={{
                        backgroundColor: isLoading ? "#ecf1fa" : "#6096ff",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        width: "127px",
                        height: "40px",
                        fontWeight: 500,
                        fontSize: "16px",
                      }}
                      disabled={isLoading}
                      gaCategory="New Author Show"
                      gaAction="Click Save Button in Edit Profile "
                      gaLabel={`Save author : ${author.id} profile`}
                      content="Save Changes"
                    />
                  </div>
                </div>
              </form>
            );
          }}
        />
      </Dialog>
    );
  }

  private formatAffiliation = (value?: Affiliation | SuggestAffiliation | string) => {
    if (value && (value as Affiliation).name) {
      return (value as Affiliation).name;
    } else if (value && (value as SuggestAffiliation).keyword) {
      return (value as SuggestAffiliation).keyword;
    }
    return value;
  };
}

export default ModifyProfileDialog;
