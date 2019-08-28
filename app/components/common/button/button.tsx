import * as React from 'react';
import { Link, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import classNames from 'classnames/bind';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./button.scss');

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonVariant = 'text' | 'outlined' | 'contained';
export type ButtonColor = 'blue' | 'gray' | 'black';

interface BaseButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  fullWidth?: boolean;
  disabled?: boolean;
}

type LinkProps = BaseButtonProps & ReactRouterLinkProps & { type: 'link' };
type ButtonProps = BaseButtonProps &
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & { type: 'button' };
type AnchorProps = BaseButtonProps &
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & { type: 'anchor' };
type GeneralButtonProps = LinkProps | ButtonProps | AnchorProps;

const Button: React.FC<GeneralButtonProps> = props => {
  const { color = 'blue', variant = 'contained', size = 'medium', type, fullWidth, disabled, ...ownProps } = props;
  const cx = classNames.bind(styles);
  const className = cx(size, variant, color, { [styles.disabled]: disabled }, { [styles.full]: fullWidth });

  switch (type) {
    case 'link': {
      return (
        <Link {...ownProps as LinkProps} className={className}>
          {props.children}
        </Link>
      );
    }

    case 'button': {
      return (
        <button {...ownProps as ButtonProps} className={className}>
          {props.children}
        </button>
      );
    }

    case 'anchor': {
      return (
        <a {...ownProps as AnchorProps} className={className}>
          {props.children}
        </a>
      );
    }

    default:
      return null;
  }
};

export default withStyles<typeof Button>(styles)(Button);
