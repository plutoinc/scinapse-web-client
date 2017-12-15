import * as React from "react";
const styles = require("./icons.scss");

interface IIconProps extends React.SVGAttributes<SVGElement> {
  icon: string;
}

const ICONS: { [key: string]: any } = {
  AFFILIATION_ICON: require("./affiliation-icon.svg").default,
  ADDRESS_QR_CODE: "address-qr-code.png",
  ARROW_POINT_TO_DOWN: require("./arrow-point-to-down.svg").default,
  ARROW_POINT_TO_UP: require("./arrow-point-to-up.svg").default,
  ARTICLE_SOURCE: require("./article-source.svg").default,
  AUTHOR_MINUS_BUTTON: require("./author-minus-button.svg").default,
  AUTHOR_PLUS_BUTTON: require("./author-plus-button.svg").default,
  AVATAR: require("./avatar.svg").default,
  CHECKED_STEP: require("./checked-step.svg").default,
  CITED: require("./cited.svg").default,
  CLOSE_ARTICLE_REVIEW: require("./closeReview.svg").default,
  COMMENT_ICON: require("./comment-icon.svg").default,
  COMMENT: require("./comment.svg").default,
  EMAIL_ICON: require("./email-icon.svg").default,
  EMPTY_STAR: require("./empty-star.svg").default,
  EXTERNAL_SHARE: require("./external-share-icon.svg").default,
  ERROR_BACKGROUND: require("./error-background.svg").default,
  FACEBOOK_LOGO: require("./facebook-logo.svg").default,
  FAQ_BALLOON: require("./faq-balloon.svg").default,
  FAQ_CHECK: require("./faq-check.svg").default,
  FAVICON: require("./favicon.svg").default,
  FULL_NAME_ICON: require("./full-name-icon.svg").default,
  GOOGLE_LOGO: require("./google-logo.svg").default,
  H_INDEX_TOOLTIP: require("./h-index-tooltip.svg").default,
  HEADER_LOGO: require("./header-logo.svg").default,
  INTUITIVE_FEED: require("./intuitive-feed.svg").default,
  LAST_PAGE: require("./last-page.svg").default,
  NEXT_PAGE: require("./next-page.svg").default,
  NOTE_TO_REVIEWER: require("./note-to-reviewer.svg").default,
  OPEN_ARTICLE_REVIEW: require("./open-review.svg").default,
  OPEN_SORTING: require("./open-sorting.svg").default,
  ORCID_LOGO: "orcid-logo.png",
  PAPERS_LOGO: require("./papers-logo.svg").default,
  PASSWORD_ICON: require("./password-icon.svg").default,
  POWERED_BY_COMMUNITY: require("./powered-by-community.svg").default,
  REFERENCE: require("./reference.svg").default,
  REPUTATION_GRAPH: require("./reputation-graph.svg").default,
  REVIEW_BACK_STEP: require("./review-back-step.svg").default,
  REVIEW_MORE_ITEM: require("./review-more-item.svg").default,
  SEARCH_ICON: require("./search-icon.svg").default,
  SETTING_BUTTON: require("./setting-button.svg").default,
  STAR: require("./star.svg").default,
  TELEGRAM_ICON: require("./telegram-icon.svg").default,
  TOOLTIP: require("./tooltip.svg").default,
  UNSIGNED_WITH_SOCIAL: require("./unsigned-with-social.svg").default,
  WALLET_ONBORDING_IMG: require("./wallet-onbording-img.svg").default,
};

class Icon extends React.PureComponent<IIconProps, {}> {
  public render() {
    let className = styles.icon;
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    const imgSrc = ICONS[this.props.icon];

    if (!imgSrc) {
      return <i className={className}>{imgSrc}</i>;
    } else if (typeof imgSrc === "string") {
      return <img className={className} src={`https://dd2gn9pwu61vr.cloudfront.net/${imgSrc}`} alt={this.props.icon} />;
    } else {
      const icon = `
      <svg viewBox="${imgSrc.viewBox}">
        <use xlink:href="#${imgSrc.id}" />
      </svg>`;

      return <i className={className} dangerouslySetInnerHTML={{ __html: icon }} />;
    }
  }
}

export default Icon;
