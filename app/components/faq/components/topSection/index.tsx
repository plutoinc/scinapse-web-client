import * as React from "react";
import Icon from "../../../../icons/index";
// styles
const styles = require("./topSection.scss");

const TopSection = () => {
  return (
    <section className={styles.topSectionContainer}>
      <div className={styles.innerContainer}>
        <p className={styles.title}>We are here to help you.</p>
        <p className={styles.subTitle}>Browse through the most frequently asked questions.</p>
      </div>
      <Icon className={styles.checkIcon} icon="FAQ_CHECK" />
    </section>
  );
};

export default TopSection;
