import React from 'react';
import classNames from 'classnames/bind';
import { ButtonVariant, ButtonColor } from '../button/types';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./groupButton.scss');

interface GroupButtonProps {
  variant?: ButtonVariant;
  color?: ButtonColor;
  disabled?: boolean;
  className?: string;
}

const GroupButton: React.FC<GroupButtonProps> = props => {
  useStyles(s);
  const { children, variant = 'contained', color = 'blue', disabled, className } = props;

  const cx = classNames.bind(s);
  const groupButtonClassName = cx(variant, color, { [s.disabled]: disabled }, [s.groupButtonWrapper], [className!]);

  return <div className={groupButtonClassName}>{children}</div>;
};

export default GroupButton;
