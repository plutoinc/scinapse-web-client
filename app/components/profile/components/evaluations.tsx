import * as React from "react";
const styles = require("./evaluations.scss");

interface IProfileEvaluationsProps {}

class ProfileEvaluations extends React.PureComponent<IProfileEvaluationsProps, {}> {
  public render() {
    return <div className={styles.profileEvaluationWrapper} />;
  }
}

export default ProfileEvaluations;
