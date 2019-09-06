import React from 'react';
import { useSelector } from 'react-redux';
import LineVenueAuthors from './lineVenueAuthors';
import { Paper } from '../../../model/paper';
import BlockVenueAuthor from './blockVenueAuthor';
import { AppState } from '../../../reducers';
import { UserDevice } from '../../layouts/reducer';
import MobileVenueAuthors from './mobileVenueAuthors';

export type VenueAuthorType = 'block' | 'line';

interface VenueAuthorsProps {
  paper: Paper;
  pageType: Scinapse.ActionTicket.PageType;
  actionArea: Scinapse.ActionTicket.ActionArea;
  venueAuthorType?: VenueAuthorType;
}

const VenueAuthors: React.FC<VenueAuthorsProps> = ({ venueAuthorType, paper, pageType, actionArea }) => {
  const userDevice = useSelector<AppState, UserDevice>(state => state.layout.userDevice);

  if (userDevice === UserDevice.MOBILE) {
    return <MobileVenueAuthors paper={paper} pageType={pageType} actionArea={actionArea} />;
  }

  if (venueAuthorType === 'block') {
    return (
      <div style={{ marginTop: '12px' }}>
        <BlockVenueAuthor paper={paper} pageType={pageType} actionArea={actionArea} />
      </div>
    );
  }

  return (
    <div style={{ marginTop: '7px' }}>
      <LineVenueAuthors paper={paper} pageType={pageType} actionArea={actionArea} />
    </div>
  );
};

export default VenueAuthors;
