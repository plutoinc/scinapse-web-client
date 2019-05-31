import * as React from 'react';
import { withStyles } from '../../../helpers/withStylesHelper';
import copySelectedTextToClipboard from '../../../helpers/copySelectedTextToClipboard';
import { trackEvent } from '../../../helpers/handleGA';
const styles = require('./doiButton.scss');

interface DOIButtonProps {
  DOI?: string;
  style?: React.CSSProperties;
}

function copyDOI(DOI: string) {
  copySelectedTextToClipboard(`https://doi.org/${DOI}`);
  trackEvent({ category: 'Additional Action', action: 'Copy DOI' });
}

const DOIButton = ({ DOI, style }: DOIButtonProps) => {
  if (!DOI) {
    return null;
  }

  return (
    <div
      onClick={() => {
        copyDOI(DOI!);
      }}
      style={style}
      className={styles.copyDOIButton}
    >
      {`DOI : ${DOI}`}
    </div>
  );
};

export default withStyles<typeof DOIButton>(styles)(DOIButton);
