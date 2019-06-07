import { Paper } from '../../model/paper';

export interface TrackingProps {
  pageType: Scinapse.ActionTicket.PageType;
  actionArea?: Scinapse.ActionTicket.ActionArea;
}

export interface PaperItemWithToggleListProps {
  paper: Paper;
  searchQueryText?: string;
}

export interface VenueSectionProps {
  paper: Paper;
}

export interface AuthorSectionProps {
  paper: Paper;
}

export interface RefCitedListProps {
  type: 'ref' | 'cited';
  paperCount: number;
  paperId: number;
}
