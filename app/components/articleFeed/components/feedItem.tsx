import * as React from "react";
import * as moment from "moment";
import { Link } from "react-router-dom";
import Type from "../../articleShow/components/type";
import { IArticleRecord } from "../../../model/article";
import formatNumber from "../../../helpers/formatNumber";
import UserProfileIcon from "../../common/userProfileIcon";
import { trackAction } from "../../../helpers/handleGA";

const shave = require("shave").default;
const styles = require("./feedItem.scss");

export interface IFeedItemProps {
  article: IArticleRecord;
}

const ACTIVATE_POINT_THRESHOLD = 4;

class FeedItem extends React.PureComponent<IFeedItemProps, {}> {
  private abstractElement: HTMLDivElement;

  private shaveTexts() {
    if (!!this.abstractElement) {
      shave(this.abstractElement, 88);
    }
  }

  private getReviewPoint() {
    const { article } = this.props;
    const totalPoint = article.point ? formatNumber(article.point.total, 2) : 0;
    if (article.reviewSize >= ACTIVATE_POINT_THRESHOLD) {
      return <div className={`${styles.reviewPoint} ${styles.activeReviewPoint}`}>{totalPoint}</div>;
    } else {
      return <div className={styles.reviewPoint}>{totalPoint}</div>;
    }
  }

  private getReviewPointText() {
    const { article } = this.props;
    if (article.reviewSize >= ACTIVATE_POINT_THRESHOLD) {
      return <div className={`${styles.reviewPointText} ${styles.activeReviewPointText}`}>pointed</div>;
    } else {
      return <div className={styles.reviewPointText}>pointed</div>;
    }
  }

  public componentDidMount() {
    this.shaveTexts();
  }

  public render() {
    const { article } = this.props;

    return (
      <div className={styles.feedItemWrapper}>
        <div className={styles.contentSection}>
          <div className={styles.leftBox}>
            <div className={styles.tagWrapper}>
              <Type tag={article.type} />
            </div>
            <div className={styles.contentWrapper}>
              <Link
                to={`/articles/${article.id}`}
                onClick={() => trackAction(`/articles/${article.id}`, "FeedItemTitle")}
                className={styles.title}
              >
                {article.title}
              </Link>
              <Link
                to={`/articles/${article.id}`}
                onClick={() => trackAction(`/articles/${article.id}`, "FeedItemSummary")}
              >
                <div ref={ele => (this.abstractElement = ele)} className={styles.abstractSummary}>
                  {article.summary}
                </div>
              </Link>
            </div>
          </div>

          <div className={styles.rightBox}>
            <div className={styles.rightBoxContent}>
              {this.getReviewPoint()}
              {this.getReviewPointText()}
            </div>
          </div>
        </div>
        <div className={styles.informationBox}>
          <div className={styles.informationLeftBox}>
            <Link
              to={`/users/${article.createdBy.id}`}
              onClick={() => trackAction(`/users/${article.createdBy.id}`, "FeedItemInformationLeftBox")}
            >
              <div className={styles.profileImageWrapper}>
                <UserProfileIcon
                  profileImage={article.createdBy.profileImage}
                  userId={article.createdBy.id}
                  type="small"
                />
              </div>
              <div className={styles.authorInformation}>
                <div className={styles.authorName}>{article.createdBy.name}</div>
                <div className={styles.authorInstitution}>{article.createdBy.affiliation}</div>
              </div>
            </Link>
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
