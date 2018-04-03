import { List } from "immutable";
import { Paper, PaperList, PaperFactory } from "./paper";

export const BOOKMARK_PAPERS_INITIAL_STATE: PaperList = List();

export const BookmarkPaperListFactory = (papers: Paper[] = []): PaperList => {
  const recordifiedPapersArray = papers.map(paper => {
    return PaperFactory(paper);
  });

  return List(recordifiedPapersArray);
};
