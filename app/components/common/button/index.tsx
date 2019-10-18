import React from 'react';
import { Link, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import classNames from 'classnames/bind';
import { withStyles } from '../../../helpers/withStylesHelper';
import ButtonSpinner from './spinner';
import { ButtonColor, ButtonSize, ButtonVariant } from './types';
const styles = require('./button.scss');

interface BaseButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  color?: ButtonColor;
  fullWidth?: boolean;
  disabled?: boolean;
}

type LinkProps = BaseButtonProps & ReactRouterLinkProps & { elementType: 'link' };
type ButtonProps = BaseButtonProps &
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    elementType: 'button';
    isLoading?: boolean;
  };
type AnchorProps = BaseButtonProps &
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> & { elementType: 'anchor' };
export type GeneralButtonProps = LinkProps | ButtonProps | AnchorProps;

const Button: React.FC<GeneralButtonProps> = props => {
  const {
    color = 'blue',
    variant = 'contained',
    size = 'medium',
    elementType,
    fullWidth,
    disabled,
    ...ownProps
  } = props;
  const cx = classNames.bind(styles);
  const className = cx(size, variant, color, { [styles.disabled]: disabled }, { [styles.full]: fullWidth });

  switch (elementType) {
    case 'link': {
      return (
        <Link {...ownProps as LinkProps} className={className}>
          {props.children}
        </Link>
      );
    }

    case 'button': {
      const { isLoading, ...buttonProps } = ownProps as ButtonProps;

      if (isLoading) {
        const style = { ...buttonProps.style, position: 'relative' } as React.CSSProperties;

        return (
          <button {...buttonProps as ButtonProps} style={style} className={className}>
            <div style={{ visibility: 'hidden', display: 'flex' }}>{props.children}</div>
            <ButtonSpinner color={color} size={size} variant={variant} disabled={disabled!} />
          </button>
        );
      }

      return (
        <button {...buttonProps as ButtonProps} className={className} disabled={disabled}>
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
