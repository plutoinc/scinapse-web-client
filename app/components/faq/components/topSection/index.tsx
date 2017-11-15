import * as React from "react";
// styles
const styles = require("./topSection.scss");

const TopSection = () => {
  return (
    <section className={styles.topSectionContainer}>
      <div className={styles.innerContainer}>
        <p className={styles.title}>We are here to help you.</p>
        <p className={styles.subTitle}>Browse through the most frequently asked questions.</p>
      </div>

      <span className={styles.arrowIcon}>&#xE001;</span>
    </section>
  );
};

export default TopSection;
