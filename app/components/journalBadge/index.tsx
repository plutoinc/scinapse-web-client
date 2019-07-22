import React from 'react';
import { withStyles } from '../../helpers/withStylesHelper';
import classNames from 'classnames';

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
      {text}
    </label>
  );
};

export default withStyles<typeof JournalBadge>(s)(JournalBadge);
