import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import * as classNames from "classnames";
import { Formik, Form, Field, FormikErrors } from "formik";
import { withStyles } from "../../../helpers/withStylesHelper";
import validateEmail from "../../../helpers/validateEmail";
import ReduxAutoSizeTextarea from "../../../components/common/autoSizeTextarea/reduxAutoSizeTextarea";
import ScinapseFormikInput from "../../../components/common/scinapseInput/scinapseFormikInput";
import Icon from "../../../icons";
const s = require("./fullTextDialog.scss");

interface RequestFullTextProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  email: string;
  message: string;
}

function validateForm(values: FormState) {
  const errors: FormikErrors<FormState> = {};
  if (!validateEmail(values.email)) {
    errors.email = "Please enter valid e-mail address.";
  }
  return errors;
}

const RequestFullText: React.FunctionComponent<RequestFullTextProps> = props => {
  const [isLoading, setIsLoading] = React.useState(false);

  function handleSubmitForm(values: FormState) {
    setIsLoading(true);
    console.log(values);
    setIsLoading(false);
  }

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.onClose}
      classes={{
        paper: s.dialogPaper,
      }}
    >
      <div className={s.title}>Request Full-text</div>
      <div className={s.subtitle}>We will send you a checked paper by sending a request to the authors instead.</div>

      <Formik
        initialValues={{ email: "", message: "" }}
        validate={validateForm}
        onSubmit={handleSubmitForm}
        enableReinitialize
        render={({ errors }) => (
          <Form className={s.form}>
            <label htmlFor="email" className={s.label}>
              YOUR EMAIL*
            </label>
            <Field
              name="email"
              type="email"
              className={classNames({
                [s.emailInput]: true,
                [s.emailInputError]: !!errors.email,
              })}
              placeholder="ex) researcher@university.com"
              component={ScinapseFormikInput}
            />
            <label htmlFor="message" className={s.messageLabel}>
              ADD YOUR MESSAGE (Optional)
            </label>
            <Field
              name="message"
              component={ReduxAutoSizeTextarea}
              textareaClassName={s.textAreaWrapper}
              textareaStyle={{ padding: "8px" }}
              rows={3}
              placeholder="ex) I'm interested in this paper - Could you provide the full-text for it?"
            />
            <div className={s.btnWrapper}>
              <button className={s.cancelBtn} type="button" onClick={props.onClose}>
                cancel
              </button>
              <button disabled={isLoading} className={s.submitBtn} type="submit">
                <Icon icon="SEND" className={s.sendIcon} />
                Send
              </button>
            </div>
          </Form>
        )}
      />
    </Dialog>
  );
};

export default withStyles<typeof RequestFullText>(s)(RequestFullText);
