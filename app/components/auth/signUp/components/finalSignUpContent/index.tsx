import * as React from "react";
import Icon from "../../../../../icons";
import { withStyles } from "../../../../../helpers/withStylesHelper";
const s = require("./finalSignUpContent.scss");

interface FinalSignUpContentProps {
  onSubmit: () => void;
  contentType: string;
}

function withSocialCompleteContent() {
  return (
    <>
      <div className={s.finalSignUpContent}>{`Sign up is all done.
  Now, you can use full feature of service.`}</div>
      <Icon className={s.finalSignUpIconWrapper} icon="COMPLETE" />
    </>
  );
}

function withEmailCompleteContent() {
  return (
    <>
      <div className={s.finalSignUpContent}>{`Please complete your email verification
  to become an user.`}</div>
      <Icon className={s.finalSignUpIconWrapper} icon="VERIFICATION_EMAIL_ICON" />
    </>
  );
}

const FinalSignUpContent: React.FunctionComponent<FinalSignUpContentProps> = props => {
  const { onSubmit, contentType } = props;

  const finalContent = contentType === "email" ? withEmailCompleteContent() : withSocialCompleteContent();

  return (
    <div className={s.signUpContainer}>
      <form onSubmit={onSubmit} className={s.formContainer}>
        <div className={s.finalSignUpTitle}>THANK YOU FOR REGISTERING</div>
        {finalContent}
        <button type="submit" className={s.finalSignUpSubmitButton}>
          CONFIRM
        </button>
      </form>
    </div>
  );
};

export default withStyles<typeof FinalSignUpContent>(s)(FinalSignUpContent);
