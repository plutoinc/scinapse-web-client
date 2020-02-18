import React, { memo, FC } from 'react';
import { useSelector } from 'react-redux';
import { denormalize } from 'normalizr';
import { isEqual } from 'lodash';
import format from 'date-fns/format';
import Icon from '../../../../icons';
import { Paper, paperSchema } from '../../../../model/paper';
import { PaperAuthor } from '../../../../model/author';
import { formulaeToHTMLStr } from '../../../../helpers/displayFormula';
import { AppState } from '../../../../reducers';
import { Journal } from '../../../../model/journal';
import { ConferenceInstance } from '../../../../model/conferenceInstance';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./nonLinkablePaperItem.scss');

const MAXIMUM_PRE_AUTHOR_COUNT = 2;
const MAXIMUM_POST_AUTHOR_COUNT = 1;
const MAX_LENGTH_OF_ABSTRACT = 200;

const NonLinkableTitle: FC<{ title: string }> = ({ title }) => {
  const trimmedTitle = title
    .replace(/^ /gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/#[A-Z0-9]+#/g, '');

  return (
    <div>
      <span className={s.title}>{trimmedTitle}</span>
    </div>
  );
};

const NonLinkableVenue: FC<{
  journal: Journal | null;
  conferenceInstance: ConferenceInstance | null;
  publishedDate: string | null;
  year: number;
}> = ({ journal, conferenceInstance, publishedDate, year }) => {
  if (!journal && !conferenceInstance) return null;

  let publishedAtNode = null;

  if (publishedDate) {
    publishedAtNode = <span className={s.publishedDate}>{format(publishedDate, 'MMM D, YYYY')}</span>;
  } else if (!publishedDate && year) {
    publishedAtNode = <span className={s.publishedDate}>{String(year)}</span>;
  }

  let content = null;
  if (journal) {
    const impactFactor = journal.impactFactor && (
      <span className={s.ifLabel}>
        <span className={s.ifIconWrapper}>
          <Icon className={s.ifIcon} icon="IMPACT_FACTOR" />
        </span>
        <span className={s.ifLabelContentWrapper}>{journal.impactFactor.toFixed(2)}</span>
      </span>
    );

    content = (
      <span className={s.journalContent}>
        {publishedAtNode}
        {publishedAtNode && journal.title && <span className={s.middleDot}>{`·`}</span>}
        <span className={s.journalTitle}>{journal.title}</span>
        {impactFactor}
      </span>
    );
  }

  if (conferenceInstance && conferenceInstance.conferenceSeries && conferenceInstance.conferenceSeries.name) {
    const title = conferenceInstance.conferenceSeries.nameAbbrev
      ? `${conferenceInstance.conferenceSeries.nameAbbrev} (${conferenceInstance.conferenceSeries.name})`
      : conferenceInstance.conferenceSeries.name;
    content = (
      <span className={s.journalContent}>
        {publishedAtNode}
        <span className={s.venueNameReadonly}> in {title}</span>
      </span>
    );
  }

  return (
    <div className={s.wrapper}>
      <Icon icon="JOURNAL" className={s.journalIcon} />
      {content}
    </div>
  );
};

const AuthorItem: React.FC<{
  author: PaperAuthor;
  isLast: boolean;
}> = ({ author, isLast }) => {
  let affiliation = null;
  if (author.affiliation) {
    const affiliationName = author.affiliation.nameAbbrev
      ? `${author.affiliation.nameAbbrev}: ${author.affiliation.name}`
      : author.affiliation.name;
    affiliation = <span className={s.affiliation}>{`(${affiliationName})`}</span>;
  }

  let hIndex = null;
  if (author.hindex) {
    hIndex = <span className={s.hIndex}>{`H-Index: ${author.hindex}`}</span>;
  }

  return (
    <div>
      <span className={s.marker}>
        {isLast ? 'Last. ' : `#`}
        <span className={s.markerNum}>{!isLast && author.order}</span>
      </span>
      <span className={s.authorContentWrapper}>
        <span className={s.authorName}>{author.name}</span>
        {author.name && author.affiliation && ' '}
        {affiliation}
        {hIndex}
      </span>
    </div>
  );
};

const NonLinkableAuthorList: React.FC<{
  paper: Paper;
}> = ({ paper }) => {
  const { authors } = paper;

  if (authors.length === 0) return null;

  const hasMore = authors.length >= MAXIMUM_PRE_AUTHOR_COUNT + MAXIMUM_POST_AUTHOR_COUNT;

  const preAuthorList = authors.slice(0, MAXIMUM_PRE_AUTHOR_COUNT).map(author => {
    return <AuthorItem key={author.id} author={author} isLast={false} />;
  });

  const postAuthorList =
    hasMore &&
    authors.slice(-MAXIMUM_POST_AUTHOR_COUNT).map(author => {
      return <AuthorItem key={author.id} author={author} isLast />;
    });

  return (
    <div className={s.authorListWrapper}>
      <Icon className={s.authorIcon} icon="AUTHOR" />
      <span className={s.listWrapper}>
        {preAuthorList}
        {postAuthorList}
      </span>
    </div>
  );
};

const NonLinkableAbstract: React.FC<{
  paperId: string;
  abstract: string;
}> = ({ abstract }) => {
  const [isExtendContent, setIsExtendContent] = React.useState(false);
  const abstractMaxLength = MAX_LENGTH_OF_ABSTRACT;

  if (!abstract) {
    return null;
  }

  const cleanAbstract = abstract
    .replace(/^ /gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/#[A-Z0-9]+#/g, '')
    .replace(/\n|\r/g, ' ');

  let finalAbstract;
  if (cleanAbstract.length > abstractMaxLength && !isExtendContent) {
    finalAbstract = cleanAbstract.slice(0, abstractMaxLength) + '...';
  } else {
    finalAbstract = cleanAbstract;
  }

  return (
    <div className={s.abstract}>
      <span dangerouslySetInnerHTML={{ __html: formulaeToHTMLStr(finalAbstract) }} />
      {finalAbstract.length > abstractMaxLength ? (
        <label
          className={s.moreOrLess}
          onClick={() => {
            setIsExtendContent(!isExtendContent);
          }}
        >
          {isExtendContent ? <span>less</span> : <span>more</span>}
        </label>
      ) : null}
    </div>
  );
};

const NonLinkablePaperItem: FC<{ paperId: string }> = memo(({ paperId }) => {
  useStyles(s);
  const paper = useSelector<AppState, Paper | undefined>(
    state => denormalize(paperId, paperSchema, state.entities),
    isEqual
  );

  if (!paper) return null;

  return (
    <div className={s.paperItemWrapper}>
      <NonLinkableTitle title={paper.title} />
      <div style={{ marginTop: '12px' }}>
        <NonLinkableVenue
          journal={paper.journal}
          conferenceInstance={paper.conferenceInstance}
          publishedDate={paper.publishedDate}
          year={paper.year}
        />
        <NonLinkableAuthorList paper={paper} />
      </div>
      <NonLinkableAbstract paperId={paper.id} abstract={paper.abstractHighlighted || paper.abstract} />
    </div>
  );
});

export default NonLinkablePaperItem;
