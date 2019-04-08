import { schema } from "normalizr";

export interface ConferenceSeries {
  id: number;
  name: string;
  paperCount: number;
  citationCount: number;
}

export const conferenceSeriesSchema = new schema.Entity("conferenceSeries");
