import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '../../../helpers/withStylesHelper';
const styles = require('./separator.scss');

interface DashedDividerWithContentProps {
  content: string;
  wrapperClassName?: string;
  contentClassName?: string;
}
const DashedDividerWithContent: React.FC<DashedDividerWithContentProps> = React.memo(
  ({ content, wrapperClassName, contentClassName }) => {
    return (
      <div className={classNames({ [styles.wrapper]: true, [wrapperClassName!]: !!wrapperClassName })}>
        <div className={styles.dash} />
        <div className={classNames({ [styles.content]: true, [contentClassName!]: !!contentClassName })}>{content}</div>
        <div className={styles.dash} />
      </div>
    );
  }
);

export default withStyles<typeof DashedDividerWithContent>(styles)(DashedDividerWithContent);
