import React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../helpers/withStylesHelper';
import Icon from '../../icons';

const s = require('./journalBadge.scss');

interface JournalBadgeProps {
  text: string;
  labelClassName?: string;
}

const JournalBadge: React.FC<JournalBadgeProps> = ({ text, labelClassName }) => {
  return (
    <label
      className={classNames({
        [s.label]: true,
        [labelClassName!]: !!labelClassName,
      })}
    >
      <Icon icon="STAR_BADGE" className={s.starBadgeIcon} />
      <span className={s.text}>{text}</span>
    </label>
  );
};

export default withStyles<typeof JournalBadge>(s)(JournalBadge);
