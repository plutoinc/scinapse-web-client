import React, { useEffect } from 'react';
import classNames from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '../../helpers/withStylesHelper';
import alertToast from '../../helpers/makePlutoToastAction';
import GroupButton from '../common/groupButton';
import Button from '../common/button';
import { ButtonVariant, ButtonColor } from '../common/button/types';
const s = require('./emailToggleItem.scss');

interface EmailToggleItemProps {
  title: string;
  subtitle: string;
  active: boolean;
  onClick: (nextStatus: boolean) => void;
  isLoading: boolean;
  hasFailed: boolean;
  isMobile: boolean;
  globalInActive?: boolean;
}

function getActiveButtonProps(active: boolean) {
  if (!active) return { variant: 'outlined' as ButtonVariant, color: 'gray' as ButtonColor };

  return { variant: 'contained' as ButtonVariant, color: 'blue' as ButtonColor };
}

function getInActiveButtonProps(inActive: boolean) {
  if (!inActive) return { variant: 'outlined' as ButtonVariant, color: 'gray' as ButtonColor };

  return { variant: 'contained' as ButtonVariant, color: 'black' as ButtonColor };
}

const EmailToggleItem: React.FC<EmailToggleItemProps> = ({
  title,
  subtitle,
  active,
  onClick,
  hasFailed,
  isLoading,
  isMobile,
  globalInActive,
}) => {
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

  const disabledButton = globalInActive || isLoading;

  return (
    <div className={s.toggleItemWrapper}>
      <div className={s.toggleItemContext}>
        <div className={s.toggleItemTitle}>{title}</div>
        <div className={s.toggleItemSubtitle}>{subtitle}</div>
      </div>
      <div
        className={classNames({
          [s.toggleButtonWrapper]: true,
          [s.blockedToggleButtonWrapper]: disabledButton,
        })}
      >
        {isLoading && <CircularProgress className={s.loadingSpinner} disableShrink={true} size={20} thickness={8} />}
        <GroupButton variant="text" disabled={globalInActive} className={s.buttonsWrapper}>
          <Button
            elementType="button"
            size="medium"
            disabled={globalInActive || isLoading}
            onClick={() => {
              onClick(true);
            }}
            {...getActiveButtonProps(active)}
            fullWidth={isMobile}
          >
            <span>On</span>
          </Button>
          <Button
            elementType="button"
            size="medium"
            variant="outlined"
            color="gray"
            disabled={globalInActive || isLoading}
            onClick={() => {
              onClick(false);
            }}
            {...getInActiveButtonProps(!active)}
            style={!active ? { border: '1px solid #d8dde7' } : {}}
            fullWidth={isMobile}
          >
            <span>Off</span>
          </Button>
        </GroupButton>
      </div>
    </div>
  );
};

export default withStyles<typeof EmailToggleItem>(s)(EmailToggleItem);
