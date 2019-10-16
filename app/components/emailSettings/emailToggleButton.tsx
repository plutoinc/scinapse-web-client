import React, { useEffect } from 'react';
import classNames from 'classnames';
import { LinkProps as ReactRouterLinkProps } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ButtonVariant, ButtonColor } from '../common/button/types';
import GroupButton from '../common/groupButton';
import Button from '../common/button';
import alertToast from '../../helpers/makePlutoToastAction';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./emailSettings.scss');

interface BasedToggleButtonProps {
  disabled?: boolean;
  hasFailed?: boolean;
}

type CombinedToggleButtonProps = BasedToggleButtonProps & {
  buttonType: 'combined';
  active: boolean;
  onClick: (nextStatus: boolean) => void;
  isLoading: boolean;
};

type SingleToggleButtonProps = BasedToggleButtonProps & ReactRouterLinkProps & { buttonType: 'single' };

type GeneralToggleButtonProps = CombinedToggleButtonProps | SingleToggleButtonProps;

function getActiveButtonProps(active: boolean) {
  if (!active) return { variant: 'outlined' as ButtonVariant, color: 'gray' as ButtonColor };

  return { variant: 'contained' as ButtonVariant, color: 'blue' as ButtonColor };
}

function getInActiveButtonProps(inActive: boolean) {
  if (!inActive) return { variant: 'outlined' as ButtonVariant, color: 'gray' as ButtonColor };

  return { variant: 'contained' as ButtonVariant, color: 'black' as ButtonColor };
}

const EmailToggleButton: React.FC<GeneralToggleButtonProps> = props => {
  useStyles(s);

  console.log('render');

  const { buttonType, hasFailed, ...ownProps } = props;

  useEffect(
    () => {
      if (hasFailed) {
        alertToast({
          type: 'error',
          message: 'Failed to update email setting!',
        });
      }
    },
    [hasFailed]
  );

  switch (buttonType) {
    case 'combined':
      const { disabled, onClick, active, isLoading } = ownProps as CombinedToggleButtonProps;

      return (
        <>
          <div className={s.loadingSpinnerWrapper}>
            {isLoading && (
              <CircularProgress className={s.loadingSpinner} disableShrink={true} size={20} thickness={8} />
            )}
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
                {...getActiveButtonProps(active)}
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
                {...getInActiveButtonProps(!active)}
                style={{ border: '1px solid #d8dde7' }}
                fullWidth={true}
              >
                <span>Off</span>
              </Button>
            </GroupButton>
          </div>
        </>
      );
    case 'single':
      const { to } = ownProps as SingleToggleButtonProps;
      return (
        <div className={s.toggleButtonWrapper}>
          <Button elementType="link" to={to} size="medium" fullWidth={true}>
            <span>Setting</span>
          </Button>
        </div>
      );
  }
};

export default EmailToggleButton;
