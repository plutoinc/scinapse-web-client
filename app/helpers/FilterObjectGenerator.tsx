import { Filter, RawFilter } from '../api/member';
import PapersQueryFormatter from './searchQueryManager';

export function objectifyRawFilterList(filter: RawFilter[] = []) {
  return filter.map(f => {
    return { ...f, filter: PapersQueryFormatter.objectifyPaperFilter(f.filter) };
  });
}

export function stringifyFullFilterList(filter: Filter[] = []) {
  return filter.map(f => {
    return { ...f, filter: PapersQueryFormatter.getStringifiedPaperFilterParams(f.filter) };
  });
}
