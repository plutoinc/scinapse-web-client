import * as React from "react";
import Icon from "../../../../../icons";
import { withStyles } from "../../../../../helpers/withStylesHelper";
const s = require("./finalWithEmail.scss");

interface FinalWithEmailProps {
  onSubmit: () => void;
}

const FinalWithEmail: React.FunctionComponent<FinalWithEmailProps> = props => {
  const { onSubmit } = props;
  return (
    <div className={s.signUpContainer}>
      <form onSubmit={onSubmit} className={s.formContainer}>
        <div className={s.finalWithEmailTitle}>THANK YOU FOR REGISTERING</div>
        <div className={s.finalWithEmailContent}>{`Please complete your email verification
          to become an user.`}</div>
        <Icon className={s.finalWithEmailIconWrapper} icon="VERIFICATION_EMAIL_ICON" />
        <button type="submit" className={s.finalWithEmailSubmitButton}>
          CONFIRM
        </button>
      </form>
    </div>
  );
};

export default withStyles<typeof FinalWithEmail>(s)(FinalWithEmail);
