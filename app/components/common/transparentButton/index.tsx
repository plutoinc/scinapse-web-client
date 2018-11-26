import * as React from "react";
import { trackEvent } from "../../../helpers/handleGA";
import { withStyles } from "../../../helpers/withStylesHelper";
import Icon from "../../../icons";
const styles = require("./transparentButton.scss");

interface TransparentButtonProps {
  content: string;
  gaCategory: string;
  icon?: string;
  style?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  onClick: ((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void);
  disabled?: boolean;
}

class TransparentButton extends React.PureComponent<TransparentButtonProps> {
  public render() {
    const { content, style, disabled, icon, iconStyle } = this.props;

    return (
      <button style={style} onClick={this.handleClickEvent} disabled={disabled} className={styles.button}>
        {icon ? <Icon style={iconStyle} icon={icon} className={styles.iconWrapper} /> : null}
        <span>{content}</span>
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

export default withStyles<typeof TransparentButton>(styles)(TransparentButton);
