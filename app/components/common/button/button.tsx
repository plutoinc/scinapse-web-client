import * as React from 'react';
import { Link, LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import classNames from 'classnames/bind';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./button.scss');

interface BaseButtonProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'blue' | 'gray' | 'black';
  fullWidth?: boolean;
  disabled?: boolean;
}

type LinkProps = BaseButtonProps & ReactRouterLinkProps;
type ButtonProps = BaseButtonProps &
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;
type AnchorProps = BaseButtonProps &
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;
type GeneralButtonProps = LinkProps | ButtonProps | AnchorProps;

function isButtonProps(props: GeneralButtonProps): props is ButtonProps {
  return (props as AnchorProps).href === undefined && (props as LinkProps).to === undefined;
}

function isLinkProps(props: GeneralButtonProps): props is LinkProps {
  return (props as LinkProps).to !== undefined;
}

function isAnchorProps(props: GeneralButtonProps): props is AnchorProps {
  return (props as AnchorProps).href === undefined;
}

const Button: React.FC<GeneralButtonProps> = props => {
  const { color = 'blue', variant = 'contained', size = 'medium' } = props;
  const cx = classNames.bind(styles);
  const className = cx(size, variant, color, { [styles.disabled]: props.disabled }, { [styles.full]: props.fullWidth });

  if (isLinkProps(props)) {
    const { color, variant, size, fullWidth, disabled, ...ownProps } = props;
    return (
      <Link {...ownProps} className={className}>
        {props.children}
      </Link>
    );
  }

  if (isAnchorProps(props)) {
    const { color, variant, size, fullWidth, disabled, ...ownProps } = props;
    return (
      <a {...ownProps} className={className}>
        {props.children}
      </a>
    );
  }

  if (isButtonProps(props)) {
    const { color, variant, size, fullWidth, disabled, ...ownProps } = props;
    return (
      <button {...ownProps} className={className}>
        {props.children}
      </button>
    );
  }

  return null;
};

export default withStyles<typeof Button>(styles)(Button);
