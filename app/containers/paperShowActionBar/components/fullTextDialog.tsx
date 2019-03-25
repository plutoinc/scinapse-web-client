import * as React from "react";
import Dialog from "@material-ui/core/Dialog";
import { Formik, Form, Field, FormikErrors } from "formik";
import { withStyles } from "../../../helpers/withStylesHelper";
import validateEmail from "../../../helpers/validateEmail";
import ReduxAutoSizeTextarea from "../../../components/common/autoSizeTextarea/reduxAutoSizeTextarea";
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
  function handleSubmitForm(values: FormState) {
    console.log(values);
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
      >
        <Form className={s.form}>
          <label htmlFor="email" className={s.label}>
            YOUR EMAIL*
          </label>
          <Field name="email" type="email" className={s.emailInput} placeholder="ex) researcher@university.com" />
          <label htmlFor="message" className={s.label}>
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

          <button onClick={props.onClose}>cancel</button>
          <button type="submit">Send</button>
        </Form>
      </Formik>
    </Dialog>
  );
};

export default withStyles<typeof RequestFullText>(s)(RequestFullText);
