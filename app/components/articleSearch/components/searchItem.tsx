import * as React from "react";
import { IArticleRecord } from "../../../model/article";

// const shave = require("shave").default;
const styles = require("./searchItem.scss");

export interface ISearchItemProps {
  article: IArticleRecord;
}
class SearchItem extends React.PureComponent<ISearchItemProps, {}> {
  // private abstractElement: HTMLDivElement;

  // private shaveTexts() {
  //   if (!!this.abstractElement) {
  //     shave(this.abstractElement, 88);
  //   }
  // }

  // public componentDidMount() {
  //   this.shaveTexts();
  // }

  public render() {
    const { article } = this.props;
    console.log("article is ", article);
    return (
      <div className={styles.searchItemWrapper}>
        <div className={styles.contentSection}>
          <div className={styles.title}>
            Apoptosis of malignant human B cells by ligation of CD20 with monoclonal antibodies.
          </div>
          <div className={styles.authorList}>
            <span className={styles.underline}>Blood</span>
            <span className={styles.bold}>[IF: 5.84]</span>
            <div className={styles.separatorLine} />
            <span className={styles.bold}>1988</span>
            <div className={styles.separatorLine} />
            Darning Shan
            <div className={styles.authorHIndex}>5</div>
            {`(University of Washington), Jeffrey A. Ledbetter (University of Washington), Oliver W Press`}
            <div className={styles.authorHIndex}>11</div>
            {`(Fred Hutchinson Cancer Research Center)`}
          </div>
          <div
            className={styles.content}
          >{`A cluster of risk factors for cardiovascular disease and type 2 diabetes mellitus, which occur together more often than by chance alone, have become known as the metabolic syndrome. The risk factors include raised blood pressure, dyslipidemia (raised triglycerides and lowered high-density lipoprotein cholesterol), raised fasting glucose, and central obesity. Various diagnostic criteria have been proposed by different organizations over the past decade. Most recently, these have come from the International Diabetes Federation and the American Heart Association/National Heart, Lung, and Blood Institute. The main difference concerns the measure for central obesity, with this being an obligatory component in the International Diabetes Federation definition, lower than in the American Heart Association/National Heart, Lung, and Blood Institute criteria, and ethnic specific. The present article represents the outcome of a meeting between several major organizations in an attempt to unify criteria. It was agreed that there should not be an obligatory component, but that waist measurement would continue to be a useful preliminary screening tool. Three abnormal findings out of 5 would qualify a person for the metabolic syndrome. A single set of cut points would be used for all components except waist circumference, for which further work is required. In the interim, national or regional cut points for waist circumference can be used.`}</div>
          <div className={styles.keywordList}>
            <span className={styles.keyword}>Apoptosis</span>
            <span className={styles.separatorPoint}>·</span>
            <span className={styles.keyword}>Apoptosis</span>
            <span className={styles.separatorPoint}>·</span>
            <span className={styles.keyword}>Apoptosis</span>
            <span className={styles.separatorPoint}>·</span>
            <span className={styles.keyword}>Apoptosis</span>
            <span className={styles.separatorPoint}>·</span>
            <span className={styles.keyword}>Apoptosis</span>
          </div>
          <div className={styles.infoList}>
            <div className={styles.referenceButton}>Ref 21</div>
            <div className={styles.citedButton}>Cited 682</div>
            <span className={styles.explanation}>Cited Paper Avg IF</span>
            <span className={styles.citedPaperAvgIF}>2.22</span>
            <div className={styles.separatorLine} />
            <span className={styles.explanation}>Pltuo Score</span>
            <span className={styles.pltuoScore}>32.232</span>
            <div className={styles.rightBox}>
              <div className={styles.sourceButton}>Source</div>
              <div className={styles.copyDOIButton}>Copy DOI</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchItem;
