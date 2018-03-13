import * as React from "react";
import { withStyles } from "../helpers/withStylesHelper";
const styles = require("./icons.scss");

interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: string;
}

const ICONS: { [key: string]: any } = {
  AFFILIATION_ICON: require("./affiliation-icon.svg").default,
  CITED: require("./cited.svg").default,
  COMMENT_MORE_ITEM: require("./comment-more-item.svg").default,
  COMMENTS_CLOSE: require("./comments-close.svg").default,
  COMMENTS_OPEN: require("./comments-open.svg").default,
  EMAIL_ICON: require("./email-icon.svg").default,
  EMAIL_VERIFICATION_COMPLETE: require("./email-verification-complete.svg").default,
  EMAIL_VERIFICATION_FAIL: require("./email-verification-fail.svg").default,
  EMAIL_VERIFICATION_NEEDED: require("./email-verification-needed.svg").default,
  ERROR_BACKGROUND: require("./error-background.svg").default,
  FACEBOOK_LOGO: require("./facebook-logo.svg").default,
  FULL_NAME_ICON: require("./full-name-icon.svg").default,
  GOOGLE_LOGO: require("./google-logo.svg").default,
  H_INDEX_TOOLTIP: require("./h-index-tooltip.svg").default,
  INTUITIVE_FEED: require("./intuitive-feed.svg").default,
  LAST_PAGE: require("./last-page.svg").default,
  NEXT_PAGE: require("./next-page.svg").default,
  OPEN_SORTING: require("./open-sorting.svg").default,
  ORCID_LOGO: "orcid-logo.png",
  PAPERS_LOGO: require("./papers-logo.svg").default,
  PASSWORD_ICON: require("./password-icon.svg").default,
  PDF_ICON: require("./pdf-icon.svg").default,
  POWERED_BY_COMMUNITY: require("./powered-by-community.svg").default,
  REFERENCE: require("./reference.svg").default,
  SEARCH_ICON: require("./search-icon.svg").default,
  TELEGRAM_ICON: require("./telegram-icon.svg").default,
  UNSIGNED_WITH_SOCIAL: require("./unsigned-with-social.svg").default,
  VERIFICATION_EMAIL_ICON: require("./verification-email-icon.svg").default,
  SMALL_LOGO: require("./feedback-logo.svg").default,
  FEEDBACK_PENCIL: require("./feedback-pencil.svg").default,
  ELLIPSIS: require("./ellipsis.svg").default,
  JOURNAL: require("./journal.svg").default,
  AUTHOR: require("./author.svg").default,
  SOURCE_LINK: require("./source-link.svg").default,
};

@withStyles<typeof Icon>(styles)
class Icon extends React.PureComponent<IconProps, {}> {
  public render() {
    let className = styles.icon;
    if (this.props.className) {
      className = `${styles.icon} ${this.props.className}`;
    }

    const imgSrc = ICONS[this.props.icon];

    if (!imgSrc) {
      return <i className={className}>{imgSrc}</i>;
    } else if (typeof imgSrc === "string") {
      const s3Url = "https://dd2gn9pwu61vr.cloudfront.net";

      return <img className={className} src={`${s3Url}/${imgSrc}`} alt={this.props.icon} />;
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
