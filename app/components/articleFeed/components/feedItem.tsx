import * as React from "react";
import * as moment from "moment";
import Type from "../../articleShow/components/type";
// import RoundImage from "../../common/roundImage";
import Icon from "../../../icons/index";
import { IArticleRecord } from "../../../model/article";

const shave = require("shave").default;
const styles = require("./feedItem.scss");

export interface IFeedItemProps {
  article: IArticleRecord;
}

const ACTIVATE_POINT_THRESHOLD = 5;

class FeedItem extends React.PureComponent<IFeedItemProps, {}> {
  private abstractElement: HTMLDivElement;

  private shaveTexts() {
    if (!!this.abstractElement) {
      shave(this.abstractElement, 84);
    }
  }

  private getEvaluationPoint() {
    const { article } = this.props;

    if (article.evaluations.count() >= ACTIVATE_POINT_THRESHOLD) {
      return <div className={`${styles.evaluationPoint} ${styles.activeEvaluationPoint}`}>7.4</div>;
    } else {
      return <div className={styles.evaluationPoint}>7.4</div>;
    }
  }

  public componentDidMount() {
    this.shaveTexts();
  }

  public render() {
    const { article } = this.props;

    return (
      <div className={styles.feedItemWrapper}>
        <div className={styles.tagWrapper}>
          <Type tag={article.type} />
        </div>
        <div className={styles.contentWrapper}>
          <div className={styles.leftBox}>
            <div className={styles.title}>{article.title}</div>
            <div ref={ele => (this.abstractElement = ele)} className={styles.abstractSummary}>
              {article.abstract}
            </div>
          </div>
          <div className={styles.rightBox}>
            {this.getEvaluationPoint()}
            <div className={styles.evaluationPointText}>pointed</div>
          </div>
        </div>
        <div className={styles.informationBox}>
          <div className={styles.informationLeftBox}>
            <div>
              <div className={styles.profileImageWrapper}>
                {/* <RoundImage width={36} height={36} /> */}
                <Icon className={styles.avatarIcon} icon="AVATAR" />
              </div>
              <div className={styles.authorInformation}>
                <div className={styles.authorName}>{article.createdBy.fullName}</div>
                <div className={styles.authorOrganization}>{article.createdBy.email}</div>
              </div>
            </div>
          </div>
          <div className={styles.informationRightBox}>
            <div className={styles.createdAt}>{moment(article.createdAt).format("ll")}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default FeedItem;
