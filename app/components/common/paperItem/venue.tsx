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
  let impactFactor = null;

  if (journal && journal.title) {
    title = readOnly ? (
      <span className={styles.venueNameReadonly}>in {journal.title}</span>
    ) : (
      <>
        in{' '}
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
      </>
    );
    impactFactor = journal.impactFactor;
  } else if (conferenceInstance && conferenceInstance.conferenceSeries && conferenceInstance.conferenceSeries.name) {
    title = <span className={styles.venueNameReadonly}> in {conferenceInstance.conferenceSeries.name}</span>;
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
      <Icon icon="JOURNAL" />

      <div className={styles.journalText}>
        Published {publishedDate ? <span className={styles.bold}>{yearStr}</span> : null}
        {title}
        {impactFactor ? (
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
              {impactFactor ? impactFactor.toFixed(2) : 0}
            </span>
          </span>
        ) : null}
        {isPaperShow && isPaperDescription ? <DoiInPaperShow doi={doi} paperId={paperId} /> : null}
      </div>
    </div>
  );
};

export default withStyles<typeof PaperItemVenue>(styles)(PaperItemVenue);
