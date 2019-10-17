import { RouteComponentProps } from 'react-router-dom';
import { FilterObject } from '../../../helpers/searchQueryManager';

export type SearchQueryInputProps = React.InputHTMLAttributes<HTMLInputElement> &
  RouteComponentProps<any> & {
    actionArea: 'home' | 'topBar' | 'paperShow';
    maxCount: number;
    currentFilter?: FilterObject;
    wrapperClassName?: string;
    listWrapperClassName?: string;
    inputClassName?: string;
    sort?: Scinapse.ArticleSearch.SEARCH_SORT_OPTIONS;
  };

export type SearchSourceType = 'history' | 'suggestion' | 'raw';

export interface SubmitParams {
  from: SearchSourceType;
  query: string;
}
