import * as React from "react";
import Icon from "../../../icons";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./verificationNeeded.scss");

interface VerificationNeededParams {
  email: string;
  resendEmailFunc: () => void;
}

const VerificationNeeded = ({ email, resendEmailFunc }: VerificationNeededParams) => (
  <div className={styles.verificationNeededContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.title}>VERIFICATION NEEDED</div>
      <div className={styles.content}>{`User has not been verified yet.
      Use this feature after email verification.`}</div>
      <Icon className={styles.emailVerificationNeededIconWrapper} icon="EMAIL_VERIFICATION_NEEDED" />
      <div onClick={resendEmailFunc} className={styles.resendEmailButton}>
        RESEND MAIL
      </div>
      <div className={styles.toEmail}>
        to <span className={styles.email}>{email}</span>
      </div>
    </div>
  </div>
);

export default withStyles<typeof VerificationNeeded>(styles)(VerificationNeeded);
