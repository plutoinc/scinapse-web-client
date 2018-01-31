import * as React from "react";
const styles = require("./feedbackButton.scss");

const FeedbackButton = () => {
  return (
    <a
      className={styles.feedbackButton}
      href="https://docs.google.com/forms/d/e/1FAIpQLSeqrI59V-HlbaL1HaudUi1rSE1WEuMpBI-6iObJ-wHM7NhRWA/viewform?usp=sf_link"
      target="_blank"
    >
      Feedback
    </a>
  );
};

export default FeedbackButton;
