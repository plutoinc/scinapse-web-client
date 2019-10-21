import React from 'react';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ButtonVariant, ButtonColor } from '../common/button/types';
import GroupButton from '../common/groupButton';
import Button from '../common/button';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./emailToggleButton.scss');

interface EmailToggleButtonProps {
  active: boolean;
  onClick: (nextStatus: boolean) => void;
  isLoading: boolean;
  disabled: boolean;
}

function getActiveButtonProps(active: boolean) {
  if (!active) return { variant: 'outlined' as ButtonVariant, color: 'gray' as ButtonColor };

  return { variant: 'contained' as ButtonVariant, color: 'blue' as ButtonColor };
}

function getInActiveButtonProps(inActive: boolean) {
  if (!inActive) return { variant: 'outlined' as ButtonVariant, color: 'gray' as ButtonColor };

  return { variant: 'contained' as ButtonVariant, color: 'black' as ButtonColor };
}

const EmailToggleButton: React.FC<EmailToggleButtonProps> = props => {
  useStyles(s);

  const { isLoading, disabled, onClick, active } = props;

  const activeButtonProps = getActiveButtonProps(active);
  const inActiveButtonProps = getInActiveButtonProps(!active);

  return (
    <>
      <div className={s.loadingSpinnerWrapper}>
        {isLoading && <CircularProgress className={s.loadingSpinner} disableShrink={true} size={20} thickness={8} />}
      </div>
      <div
        className={classNames({
          [s.toggleButtonWrapper]: true,
          [s.blockedToggleButtonWrapper]: disabled,
        })}
      >
        <GroupButton variant="text" disabled={disabled} className={s.buttonsWrapper}>
          <Button
            elementType="button"
            size="medium"
            disabled={disabled}
            onClick={() => onClick(true)}
            {...activeButtonProps}
            fullWidth={true}
            style={disabled ? { border: '1px solid #d8dde7' } : {}}
          >
            <span>On</span>
          </Button>
          <Button
            elementType="button"
            size="medium"
            variant="outlined"
            color="gray"
            disabled={disabled}
            onClick={() => onClick(false)}
            {...inActiveButtonProps}
            style={{ border: '1px solid #d8dde7' }}
            fullWidth={true}
          >
            <span>Off</span>
          </Button>
        </GroupButton>
      </div>
    </>
  );
};

export default EmailToggleButton;
