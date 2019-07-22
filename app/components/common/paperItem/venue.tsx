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
const styles = require('./venueAndAuthors.scss');

interface PaperItemVenueProps {
  journal: Journal | null;
  paperId: number;
  conferenceInstance: ConferenceInstance | null;
  publishedDate: string | null;
  doi: string;
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
      {journal.impactFactor && (
        <span className={styles.ifLabel}>
          <span>
            <Tooltip
              title="Impact Factor"
              placement="top"
              classes={{ tooltip: styles.arrowBottomTooltip }}
              disableFocusListener
              disableTouchListener
            >
              <span>
                <Icon className={styles.ifIconWrapper} icon="IMPACT_FACTOR" />
              </span>
            </Tooltip>
            {journal.impactFactor.toFixed(2)}
          </span>
        </span>
      )}
      {journal.sci && <JournalBadge text="SCI" labelClassName={styles.SCILabel} />}
    </>
  );
};

const PaperItemVenue = ({
  journal,
  paperId,
  conferenceInstance,
  publishedDate,
  doi,
  style,
  readOnly,
  pageType,
  actionArea,
}: PaperItemVenueProps) => {
  if (!journal && !publishedDate) {
    return null;
  }

  let title = null;
  if (journal && journal.title) {
    title = <JournalTitle journal={journal} readOnly={readOnly} pageType={pageType} actionArea={actionArea} />;
  } else if (conferenceInstance) {
    title = <ConferenceTitle conferenceInstance={conferenceInstance} />;
  }

  const yearStr = publishedDate ? (
    <span>
      on <span className={styles.venueNameReadonly}>{format(publishedDate, 'MMM D, YYYY')}</span>
    </span>
  ) : null;

  const isPaperShow = pageType === 'paperShow';
  const isPaperDescription = actionArea === 'paperDescription';

  return (
    <div
      style={style}
      className={classNames({
        [styles.venue]: true,
        [`${styles.venue} ${styles.margin}`]: isPaperShow && isPaperDescription,
      })}
    >
      <Icon className={styles.journalIcon} icon="JOURNAL" />
      <div className={styles.journalText}>
        Published {publishedDate ? <span className={styles.bold}>{yearStr}</span> : null}
        {title}
        {isPaperShow && isPaperDescription ? <DoiInPaperShow doi={doi} paperId={paperId} /> : null}
      </div>
    </div>
  );
};

export default withStyles<typeof PaperItemVenue>(styles)(PaperItemVenue);
