import * as React from 'react';
import { Link } from 'react-router-dom';
import * as format from 'date-fns/format';
import * as classNames from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import { Journal } from '../../../model/journal';
import { withStyles } from '../../../helpers/withStylesHelper';
import Icon from '../../../icons';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { ConferenceInstance } from '../../../model/conferenceInstance';
import DoiInPaperShow from '../../paperShow/components/doiInPaperShow';
import JournalBadge from '../../journalBadge';
import { Paper } from '../../../model/paper';
const styles = require('./lineVenueAuthors.scss');

interface PaperItemVenueProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

const ConferenceTitle: React.FC<{
  conferenceInstance: ConferenceInstance;
}> = ({ conferenceInstance }) => {
  if (!conferenceInstance.conferenceSeries) return null;

  if (conferenceInstance.conferenceSeries.nameAbbrev) {
    return (
      <span className={styles.venueNameReadonly}>
        {' '}
        in {`${conferenceInstance.conferenceSeries.nameAbbrev} (${conferenceInstance.conferenceSeries.name})`}
      </span>
    );
  }

  return <span className={styles.venueNameReadonly}> in {conferenceInstance.conferenceSeries.name}</span>;
};

const JournalTitle: React.FC<{
  journal: Journal;
  readOnly?: boolean;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}> = ({ journal, readOnly, pageType, actionArea }) => {
  if (!journal.title) return null;

  if (readOnly) {
    return <span className={styles.venueNameReadonly}>{`in ${journal.title}`}</span>;
  }

  return (
    <>
      <span>{`in `}</span>
      <Link
        to={`/journals/${journal.id}`}
        onClick={() => {
          ActionTicketManager.trackTicket({
            pageType,
            actionType: 'fire',
            actionArea: actionArea || pageType,
            actionTag: 'journalShow',
            actionLabel: String(journal.id),
          });
        }}
        className={styles.venueName}
      >
        {journal.title}
      </Link>
      {journal.sci && <JournalBadge text="SCI(E)" labelClassName={styles.journalBadge} />}
      {journal.impactFactor && (
        <Tooltip
          title="Impact Factor"
          placement="top"
          classes={{ tooltip: styles.arrowBottomTooltip }}
          disableFocusListener
          disableTouchListener
        >
          <span className={styles.ifLabel}>
            <Icon className={styles.ifIconWrapper} icon="IMPACT_FACTOR" />
            <span>{journal.impactFactor.toFixed(2)}</span>
          </span>
        </Tooltip>
      )}
    </>
  );
};

const LineVenue = ({ style, readOnly, pageType, paper, actionArea }: PaperItemVenueProps) => {
  const { conferenceInstance, publishedDate, doi, journal, year } = paper;
  if (!journal && !publishedDate) return null;

  let title = null;
  if (journal && journal.title) {
    title = <JournalTitle journal={journal} readOnly={readOnly} pageType={pageType} actionArea={actionArea} />;
  } else if (conferenceInstance) {
    title = <ConferenceTitle conferenceInstance={conferenceInstance} />;
  }

  let yearStr = format(publishedDate, 'MMM D, YYYY');

  if (!publishedDate && year) {
    yearStr = String(year);
  }

  const lineYear = (
    <span>
      on <span className={styles.venueNameReadonly}>{yearStr}</span>
    </span>
  );

  const isPaperShow = pageType === 'paperShow';
  const isPaperDescription = actionArea === 'paperDescription';

  return (
    <div
      style={style}
      className={classNames({
        [styles.venue]: true,
        [styles.margin]: isPaperShow && isPaperDescription,
      })}
    >
      <Icon className={styles.journalIcon} icon="JOURNAL" />
      <div className={styles.journalText}>
        Published <span className={styles.bold}>{lineYear}</span>
        {title}
        {isPaperShow && isPaperDescription ? <DoiInPaperShow doi={doi} paperId={paper.id} /> : null}
      </div>
    </div>
  );
};

export default withStyles<typeof LineVenue>(styles)(LineVenue);
