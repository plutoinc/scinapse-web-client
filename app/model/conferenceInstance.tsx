import { schema } from 'normalizr';
import { ConferenceSeries } from './conferenceSeries';

export interface ConferenceInstance {
  id: string;
  conferenceSeries: ConferenceSeries | null;
  name: string;
  location: string | null;
  officialUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  abstractRegistrationDate: string | null;
  submissionDeadlineDate: string | null;
  notificationDueDate: string | null;
  finalVersionDueDate: string | null;
  paperCount: number;
  citationCount: number;
}

export const conferenceInstanceSchema = new schema.Entity('conferenceInstances');
