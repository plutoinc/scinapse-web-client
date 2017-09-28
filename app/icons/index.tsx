import * as React from "react";
const styles = require("./icons.scss");

interface IIconProps extends React.SVGAttributes<SVGElement> {
  icon: string;
}

const ICONS: { [key: string]: any } = {
  ARROW_POINT_TO_DOWN: require("./arrow-point-to-down.svg").default,
  ARROW_POINT_TO_UP: require("./arrow-point-to-up.svg").default,
  AUTHOR_ADD_BUTTON: require("./author-add-button.svg").default,
  AVATAR: require("./avatar.svg").default,
  COMMENT: require("./comment.svg").default,
  DIALOG_LOGO: require("./dialog-logo.svg").default,
  EMAIL_ICON: require("./email-icon.svg").default,
  FACEBOOK: require("./facebook.svg").default,
  FAVICON: require("./favicon.svg").default,
  FOOTER_LOGO: require("./footer-logo.svg").default,
  FULL_NAME_ICON: require("./full-name-icon.svg").default,
  GITHUB: require("./github.svg").default,
  MEDIUM: require("./medium.svg").default,
  NOT_SIGNED_IN_HEADER_LOGO: require("./not-signed-in-header-logo.svg").default,
  PASSWORD_ICON: require("./password-icon.svg").default,
  SIGNED_IN_HEADER_LOGO: require("./signed-in-header-logo.svg").default,
  SETTING_BUTTON: "setting-button.jpg",
  TELEGRAM: require("./telegram.svg").default,
  TWITTER_COPY: require("./twitter-copy.svg").default,
  WALLET_ONBORDING_IMG: require("./wallet-onbording-img.svg").default,
  STAR: require("./star.svg").default,
  CLOSE_ARTICLE_EVALUATION: require("./closeEvaluation.svg").default,
  OPEN_ARTICLE_EVALUATION: require("./openEvaluation.svg").default,
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
