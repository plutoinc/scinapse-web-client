import * as React from 'react';
import * as URL from 'url';
import * as classNames from 'classnames';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '../../../helpers/withStylesHelper';
import { PaperSource } from '../../../model/paperSource';
import { trackAndOpenLink } from '../../../helpers/handleGA';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { isPDFLink } from '../../../helpers/getPDFLink';
const styles = require('./sourceURLPopover.scss');

interface SourceURLPopover {
  isOpen: boolean;
  handleCloseFunc: (e: any) => void;
  paperSources: PaperSource[];
  anchorEl: HTMLElement | null;
  pageType: Scinapse.ActionTicket.PageType;
  paperId: string;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

const SourceURLPopover: React.SFC<SourceURLPopover> = props => {
  const sources = props.paperSources.map(source => {
    const urlObj = URL.parse(source.url);

    return (
      <a
        className={styles.sourceItem}
        onClick={e => {
          trackAndOpenLink('search-item-source-button');
          ActionTicketManager.trackTicket({
            pageType: props.pageType,
            actionType: 'fire',
            actionArea: props.actionArea || props.pageType,
            actionTag: 'source',
            actionLabel: String(props.paperId),
          });
          props.handleCloseFunc(e);
        }}
        target="_blank"
        rel="noopener nofollow noreferrer"
        href={source.url}
        key={source.id}
      >
        <span
          className={classNames({
            [styles.host]: true,
            [styles.pdfHost]: isPDFLink(source),
          })}
        >
          {urlObj.host}
        </span>
        <Icon icon="EXTERNAL_SOURCE" className={styles.sourceIcon} />
      </a>
    );
  });

  return (
    <>
      <Popper
        anchorEl={props.anchorEl}
        placement="bottom-end"
        modifiers={{
          preventOverflow: {
            enabled: true,
            boundariesElement: 'window',
          },
        }}
        open={props.isOpen}
        style={{ zIndex: 10 }}
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <div className={styles.sourcesWrapper}>{sources}</div>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default withStyles<typeof SourceURLPopover>(styles)(SourceURLPopover);
