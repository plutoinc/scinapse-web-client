import { Filter, RawFilter } from "../api/member";
import PapersQueryFormatter from "./papersQueryFormatter";

export function ResponseFilterObjectGenerator(filter: RawFilter[]) {
  return filter.map(f => {
    return { ...f, filter: PapersQueryFormatter.objectifyPapersFilter(f.filter) };
  });
}

export function RequestFilterObjectGenerator(filter: Filter[]) {
  return filter.map(f => {
    return { ...f, filter: PapersQueryFormatter.getStringifiedPaperFilterParams(f.filter) };
  });
}
