import React from 'react';
import classNames from 'classnames/bind';
import { ButtonVariant, ButtonColor } from '../button/types';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./groupButton.scss');

interface GroupButtonProps {
  variant?: ButtonVariant;
  buttonBackgroundColor?: ButtonColor;
  className?: string;
}

const GroupButton: React.FC<GroupButtonProps> = props => {
  useStyles(s);
  const { children, variant = 'contained', buttonBackgroundColor = 'blue', className } = props;

  const cx = classNames.bind(s);
  const groupButtonClassName = cx(variant, buttonBackgroundColor, [s.groupButtonWrapper], [className!]);

  return <div className={groupButtonClassName}>{children}</div>;
};

export default GroupButton;
