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
}

const ConferenceTitle: React.FC<{
  conferenceInstance: ConferenceInstance;
}> = ({ conferenceInstance }) => {
  if (!conferenceInstance.conferenceSeries) return null;

  if (conferenceInstance.conferenceSeries.nameAbbrev) {
    return (
      <span className={s.readonly}>
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
  readonly?: boolean;
}> = ({ journal, pageType, actionArea, readonly }) => {
  if (!journal.title) return null;

  if (readonly) {
    return <span className={s.readonly}>{journal.title}</span>;
  }

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

const MobileVenue: React.FC<MobileVenueProps> = ({ paper, pageType, actionArea }) => {
  useStyles(s);
  const { conferenceInstance, publishedDate, journal, year } = paper;
  if (!journal && !publishedDate) return null;

  let title = null;
  if (journal && journal.title) {
    title = <JournalTitle journal={journal} pageType={pageType} actionArea={actionArea} />;
  } else if (conferenceInstance) {
    title = <ConferenceTitle conferenceInstance={conferenceInstance} />;
  }

  let date = format(publishedDate, 'YYYY');

  if (!publishedDate && year) {
    date = String(year);
  }

  return (
    <div className={s.onelineWrapper}>
      <span className={s.year}>{date}</span>
      {journal &&
        journal.impactFactor && (
          <span className={s.ifLabel}>
            <Icon className={s.ifIconWrapper} icon="IMPACT_FACTOR" />
            {journal.impactFactor.toFixed(2)}
          </span>
        )}
      {title}
    </div>
  );
};

export default MobileVenue;
