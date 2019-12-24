import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Button } from '@pluto_network/pluto-design-elements';
import { Paper } from '../../../model/paper';
import { withStyles } from '../../../helpers/withStylesHelper';
import SourceURLPopover from '../../common/sourceURLPopover';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import Icon from '../../../icons';
import { addPaperToRecommendPool } from '../../recommendPool/actions';
import GroupButton from '../../common/groupButton';
const styles = require('./pdfSourceButton.scss');

interface SourceButtonProps {
  paper: Paper;
  showFullText: boolean;
  dispatch: Dispatch<any>;
  wrapperStyle?: React.CSSProperties;
}

const SourceButton: React.FunctionComponent<SourceButtonProps> = props => {
  const { paper, showFullText, dispatch } = props;
  const [isSourcePopoverOpen, setIsSourcePopoverOpen] = React.useState(false);
  const anchorEl = React.useRef<HTMLDivElement | null>(null);

  function handleClickSource() {
    ActionTicketManager.trackTicket({
      pageType: 'paperShow',
      actionType: 'fire',
      actionArea: 'paperDescription',
      actionTag: 'source',
      actionLabel: String(paper.id),
    });
  }

  function handleCloseSourceDropdown() {
    if (isSourcePopoverOpen) {
      setIsSourcePopoverOpen(false);
    }
  }

  if (!paper.doi && paper.urls.length === 0) {
    // no source
    return null;
  }

  const sourceUrl = paper.doi ? `https://doi.org/${paper.doi}` : paper.urls[0].url;

  return (
    <ClickAwayListener onClickAway={handleCloseSourceDropdown}>
      <div>
        <div ref={anchorEl}>
          <GroupButton variant={!showFullText ? 'contained' : 'outlined'} color="blue" disabled={false}>
            <Button
              elementType="anchor"
              variant={!showFullText ? 'contained' : 'outlined'}
              href={sourceUrl}
              target="_blank"
              rel="noopener"
              onClick={async e => {
                e.preventDefault();
                handleClickSource();
                dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'source' }));
                window.open(sourceUrl, '_blank');
              }}
            >
              <Icon icon="EXTERNAL_SOURCE" />
              <span>{paper.urls.length > 0 ? 'Sources' : 'Source'}</span>
            </Button>
            {paper.urls.length > 0 ? (
              <Button
                elementType="button"
                aria-label="Source dropdown button"
                variant={!showFullText ? 'contained' : 'outlined'}
                onClick={async () => {
                  setIsSourcePopoverOpen(!isSourcePopoverOpen);
                  if (!isSourcePopoverOpen) {
                    dispatch(addPaperToRecommendPool({ paperId: paper.id, action: 'source' }));
                  }
                }}
              >
                <Icon icon={!isSourcePopoverOpen ? 'ARROW_DOWN' : 'ARROW_UP'} />
              </Button>
            ) : null}
          </GroupButton>
        </div>
        <SourceURLPopover
          isOpen={isSourcePopoverOpen}
          handleCloseFunc={handleCloseSourceDropdown}
          paperSources={paper.urls}
          pageType="paperShow"
          paperId={paper.id}
          anchorEl={anchorEl.current}
          actionArea="paperDescription"
        />
      </div>
    </ClickAwayListener>
  );
};

export default connect()(withStyles<typeof SourceButton>(styles)(SourceButton));
