import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Paper } from '../../../model/paper';
import ActionTicketManager from '../../../helpers/actionTicketManager';
import { ConferenceInstance } from '../../../model/conferenceInstance';
import { Journal } from '../../../model/journal';
import Icon from '../../../icons';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./mobileVenue.scss');

interface MobileVenueProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  isExpanded: boolean;
}

const ConferenceTitle: React.FC<{
  conferenceInstance: ConferenceInstance;
}> = ({ conferenceInstance }) => {
  if (!conferenceInstance.conferenceSeries) return null;

  if (conferenceInstance.conferenceSeries.nameAbbrev) {
    return (
      <span className={s.venueName}>
        {`${conferenceInstance.conferenceSeries.nameAbbrev}: ${conferenceInstance.conferenceSeries.name}`}
      </span>
    );
  }

  return <span className={s.venueName}>{conferenceInstance.conferenceSeries.name}</span>;
};

const JournalTitle: React.FC<{
  journal: Journal;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}> = ({ journal, pageType, actionArea }) => {
  if (!journal.title) return null;

  return (
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
      className={s.venueName}
    >
      {journal.title}
    </Link>
  );
};

const MobileVenue: React.FC<MobileVenueProps> = ({ paper, isExpanded, pageType, actionArea }) => {
  useStyles(s);
  const { conferenceInstance, publishedDate, journal } = paper;
  if (!journal && !publishedDate) return null;

  let title = null;
  if (journal && journal.title) {
    title = <JournalTitle journal={journal} pageType={pageType} actionArea={actionArea} />;
  } else if (conferenceInstance) {
    title = <ConferenceTitle conferenceInstance={conferenceInstance} />;
  }

  if (isExpanded) {
    return (
      <>
        <div>
          <span className={s.year}>{format(publishedDate, 'MMM D, YYYY')}</span>
          {journal &&
            journal.impactFactor && (
              <span className={s.ifLabel}>
                <Icon className={s.ifIconWrapper} icon="IMPACT_FACTOR" />
                {journal.impactFactor.toFixed(2)}
              </span>
            )}
          {journal && journal.sci && <span className={s.sciLabel}> (SCI)</span>}
        </div>
        <div>{title}</div>
      </>
    );
  }

  return (
    <div className={s.onelineWrapper}>
      <span className={s.year}>{format(publishedDate, 'YYYY')}</span>
      {journal &&
        journal.impactFactor && (
          <span className={s.ifLabel}>
            <Icon className={s.ifIconWrapper} icon="IMPACT_FACTOR" />
            {journal.impactFactor.toFixed(2)}
          </span>
        )}
      {journal && journal.sci && <span className={s.sciLabel}> (SCI)</span>}
      {title}
    </div>
  );
};

export default MobileVenue;
