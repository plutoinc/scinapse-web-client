import { schema } from 'normalizr';

export interface ConferenceSeries {
  id: number;
  name: string;
  paperCount: number;
  citationCount: number;
  nameAbbrev: string | null;
}

export const conferenceSeriesSchema = new schema.Entity('conferenceSeries');
