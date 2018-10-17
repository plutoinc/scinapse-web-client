import * as React from "react";
import { Link } from "react-router-dom";
import * as H from "history";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
const styles = require("./scinapseButton.scss");

interface ScinapseButtonProps {
  content: string;
  gaCategory: string;
  isReactRouterLink?: boolean;
  isExternalLink?: boolean;
  href?: string;
  to?: H.LocationDescriptor;
  style?: React.CSSProperties;
  onClick?: ((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void);
  disabled?: boolean;
}

class ScinapseButton extends React.PureComponent<ScinapseButtonProps> {
  public render() {
    const { content, isReactRouterLink, isExternalLink, to, href, style, disabled } = this.props;

    if (isReactRouterLink && to) {
      return (
        <Link style={style} onClick={this.handleClickEvent} className={styles.button} to={to}>
          {content}
        </Link>
      );
    } else if (isExternalLink && href) {
      return (
        <a style={style} onClick={this.handleClickEvent} className={styles.button} href={href}>
          {content}
        </a>
      );
    }

    return (
      <button style={style} onClick={this.handleClickEvent} disabled={!disabled} className={styles.button}>
        {content}
      </button>
    );
  }

  private handleClickEvent = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    const { gaCategory, content, onClick } = this.props;

    trackEvent({
      category: gaCategory,
      action: `Click ${content}`,
      label: content,
    });

    if (onClick) {
      onClick(e);
    }
  };
}

export default withStyles<typeof ScinapseButton>(styles)(ScinapseButton);
