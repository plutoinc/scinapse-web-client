import { Member } from '../model/member';
import { Fos } from '../model/fos';
import { Journal } from '../model/journal';
import { Paper } from '../model/paper';
import { PaperSource } from '../model/paperSource';
import { PaperAuthor } from '../model/author';
import { CurrentUser } from '../model/currentUser';
import { RawAuthor } from '../model/author/author';
import { camelCaseKeys } from '../helpers/camelCaseKeys';

export const RAW = {
  AUTHOR_IN_PAPER: require('./paperAuthor.json') as PaperAuthor,
  AUTHOR: require('./author.json') as RawAuthor,
  COMMENT: require('./comment.json') as Comment,
  CURRENT_USER: require('./currentUser.json') as CurrentUser,
  FOS: require('./fos.json') as Fos,
  JOURNAL: require('./journal.json') as Journal,
  MEMBER: require('./member.json') as Member,
  PAPER: require('./paper.json') as Paper,
  PAPER_SOURCE: require('./paperSource.json') as PaperSource,
  COMMENTS_RESPONSE: require('./commentsResponse.json'),
  AGGREGATION_RESPONSE: require('./aggregation.json'),
  JOURNAL_PAPERS_RESPONSE: require('./journalPapersResponse.json'),
  PAPER_FROM_CONFERENCE: camelCaseKeys(require('./paperFromConference.json')) as Paper,
};
