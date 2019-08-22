import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import classNames from 'classnames/bind';
const styles = require('./button.scss');

interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'text' | 'outlined' | 'contained';
  color?: 'blue' | 'gray' | 'black';
  width?: 'full-width' | 'default';
  state?: 'disabled' | 'active';
  onClick?: ((e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void);
}

class Button extends React.PureComponent<ButtonProps, {}> {
  public render() {
    let cx = classNames.bind(styles);
    let className = cx(this.props.size, this.props.variant, this.props.color, this.props.state);
    return <button className={className}>{this.props.children}</button>;
  }
}

export default withStyles<typeof Button>(styles)(Button);
