import React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import { ButtonSize } from './types';

const s = require('./spinner.scss');

interface ButtonSpinnerProps {
  color: string;
  size: ButtonSize;
  variant: string;
  className?: string;
}

function getSpinnerColor(buttonColor: string, variant: string) {
  if (variant === 'contained' && buttonColor === 'blue') return 'white';

  switch (buttonColor) {
    case 'blue':
      return '#3e7fff';
    default:
      return '#bbc2d0';
  }
}

const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({ className, size, color = 'white', variant }) => {
  return (
    <div className={s.wrapper}>
      <div
        className={classNames({
          [s['lds-ring']]: true,
          className: !!className,
          [s.mediumRing]: size === 'medium',
          [s.largeRing]: size === 'large',
        })}
      >
        <div
          style={{
            borderColor: `${getSpinnerColor(color, variant)} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${getSpinnerColor(color, variant)} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${getSpinnerColor(color, variant)} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${getSpinnerColor(color, variant)} transparent transparent transparent`,
          }}
        />
      </div>
    </div>
  );
};

export default withStyles<typeof ButtonSpinner>(s)(ButtonSpinner);
