import React from 'react';
import classNames from 'classnames/bind';
import { ButtonVariant, ButtonColor } from '../button/types';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./groupButton.scss');

interface GroupButtonProps {
  variant?: ButtonVariant;
  buttonBackgroundColor?: ButtonColor;
}

const GroupButton: React.FC<GroupButtonProps> = props => {
  useStyles(s);
  const { children, variant = 'contained', buttonBackgroundColor = 'blue' } = props;

  const cx = classNames.bind(s);
  const className = cx(variant, buttonBackgroundColor, { [s.groupButtonWrapper]: true });

  return <div className={className}>{children}</div>;
};

export default GroupButton;
