import * as React from 'react';
import { LocationDescriptor } from 'history';
import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./button.scss');

interface BaseButtonProps {}

interface ButtonProps {
  size: 'small' | 'medium' | 'large';
  variant: 'text' | 'outlined' | 'contained';
  color: 'blue' | 'gray' | 'black';
  fullWidth?: boolean;
  state?: 'disabled';
  onClick?: ((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void);
  href?: string;
  to?: LocationDescriptor;
}

const Button: React.FC<ButtonProps> = props => {
  let cx = classNames.bind(styles);
  let className = cx(props.size, props.variant, props.color, props.state, { [styles.full]: props.fullWidth });

  // if ("to" in props) {
  //   return <Link to={props.to}>
  //     {props.children}
  //   </Link>
  // }

  if (props.href) {
    return (
      <a className={className} href={props.href}>
        {props.children}
      </a>
    );
  }
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  );
};

export default withStyles<typeof Button>(styles)(Button);
