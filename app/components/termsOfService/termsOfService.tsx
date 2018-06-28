import * as React from "react";
import { withStyles } from "../../helpers/withStylesHelper";
const styles = require("./termsOfService.scss");

@withStyles<typeof TermsOfService>(styles)
class TermsOfService extends React.Component {
  public render() {
    return (
      <div className={styles.termsOfServiceContainer}>
        <div className={styles.termsOfServiceTitle}>
          PLUTO NETWORK TERMS OF SERVICE
        </div>
        <div className={styles.termsOfServiceContents}>Contents</div>
        <div className={styles.termsOfServiceTitle}>SERVICES</div>
        <div className={styles.termsOfServiceContents}>Contents</div>
        <div className={styles.termsOfServiceTitle}>PRIVACY POLICY</div>
        <div className={styles.termsOfServiceContents}>Contents</div>
      </div>
    );
  }
}

export default TermsOfService;
