import * as React from "react";
import { Tabs, Tab } from "material-ui/Tabs";
import { IArticleShowStateRecord } from "../records";
const styles = require("./evaluate.scss");

interface IArticleEvaluateProps {
  articleShow: IArticleShowStateRecord;
  handleEvaluationTabChange: () => void;
}

const ArticleEvaluate = (props: IArticleEvaluateProps) => {
  console.log(props);

  return (
    <div className={styles.evaluateWrapper}>
      <div className={styles.title}>Evaluate</div>
      <Tabs onChange={props.handleEvaluationTabChange} initialSelectedIndex={1} className={styles.tabWrapper}>
        <Tab label="Peer evaluation" />
        <Tab label="My evaluation" />
      </Tabs>
      <div className={styles.contentWrapper}>
        <div className={styles.stepWrapper}>
          <Tabs>
            <Tab
              label={
                <span className={styles.stepItem}>
                  <div>01</div>
                  <div>Originality</div>
                </span>
              }
            />
            <Tab
              label={
                <span className={styles.stepItem}>
                  <div>02</div>
                  <div>Contribution</div>
                </span>
              }
            />
            <Tab
              label={
                <span className={styles.stepItem}>
                  <div>03</div>
                  <div>Analysis</div>
                </span>
              }
            />
            <Tab
              label={
                <span className={styles.stepItem}>
                  <div>04</div>
                  <div>Expressiveness</div>
                </span>
              }
            />
          </Tabs>
        </div>
        <div className={styles.stepDescriptionWrapper}>
          Is the research proposition, method of study, object of observation, or form of overall statement unique and
          distinct from previous research?
        </div>
        <div className={styles.scoreGraphWrapper}>0, 1, 2, 3, 4, 5, 6, 7, 8 ,9, 10</div>
        <form className={styles.commentInputWrapper}>
          <input type="text" className={styles.commentWrapper} />
          <button type="submit" className={styles.commentSubmitButton}>
            Submit >
          </button>
        </form>
      </div>
    </div>
  );
};

export default ArticleEvaluate;
