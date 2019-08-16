import * as React from 'react';
import Icon from '../../../icons';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./verificationNeeded.scss');

interface VerificationNeededParams {
  email: string;
  resendEmailFunc: () => void;
}

const VerificationNeeded = ({ email, resendEmailFunc }: VerificationNeededParams) => (
  <div className={styles.verificationNeededContainer}>
    <div className={styles.innerContainer}>
      <div className={styles.title}>VERIFICATION NEEDED</div>
      <div className={styles.content}>{`You are not verified yet.
      Please check your email to use.`}</div>
      <Icon className={styles.emailVerificationNeededIconWrapper} icon="EMAIL_VERIFICATION_NEEDED" />
      <div onClick={resendEmailFunc} className={styles.resendEmailButton}>
        RESEND MAIL
      </div>
      <div className={styles.toEmail}>
        Sent to <span className={styles.email}>{email}</span>
      </div>
      <div className={styles.additionalNoti}>
        <div className={styles.notiTitle}>Didn't get the verification mail?</div>
        <div className={styles.notiContentList}>
          <Icon className={styles.notiContentCheckIcon} icon="CHECK" />
          <span className={styles.notiContent}>Check typo in your email address.</span>
        </div>
        <div className={styles.notiContentList}>
          <Icon className={styles.notiContentCheckIcon} icon="CHECK" />
          <span className={styles.notiContent}>Check your spam box.</span>
        </div>
        <div className={styles.notiContentList}>
          <Icon className={styles.notiContentCheckIcon} icon="CHECK" />
          <span className={styles.notiContent}>
            Check whether you are using spam solution. <br /> ex) BitBounce
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default withStyles<typeof VerificationNeeded>(styles)(VerificationNeeded);
