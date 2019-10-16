import React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
import { ButtonSize } from './types';

const s = require('./spinner.scss');

interface ButtonSpinnerProps {
  color: string;
  size: ButtonSize;
  variant: string;
  disabled?: boolean;
  className?: string;
}

function getSpinnerColor(buttonColor: string, variant: string, disabled?: boolean) {
  if (disabled) return '#bbc2d0';

  if (variant === 'contained' && buttonColor === 'blue') return 'white';

  switch (buttonColor) {
    case 'blue':
      return '#3e7fff';
    case 'gray':
      return '#666d7c';
    default:
      return '#34495e';
  }
}

const ButtonSpinner: React.FC<ButtonSpinnerProps> = ({ className, size, color = 'white', variant, disabled }) => {
  const spinnerColor = getSpinnerColor(color, variant, disabled);

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
            borderColor: `${spinnerColor} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${spinnerColor} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${spinnerColor} transparent transparent transparent`,
          }}
        />
        <div
          style={{
            borderColor: `${spinnerColor} transparent transparent transparent`,
          }}
        />
      </div>
    </div>
  );
};

export default withStyles<typeof ButtonSpinner>(s)(ButtonSpinner);
