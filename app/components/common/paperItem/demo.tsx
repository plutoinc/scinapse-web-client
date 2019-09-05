import React from 'react';
import PaperItem from './paperItem';
import PaperItemButtonGroup from './paperItemButtonGroup';
import CollectionPaperItemButtonGroup from './collectionPaperItemButtonGroup';
import { VenueAuthorType } from './venueAuthors';
import { Paper } from '../../../model/paper';
import { camelCaseKeys } from '../../../helpers/camelCaseKeys';
import { paperSource, paperWithFigureAndManyAuthors, paperWithNote } from './paperData';
import { useEnvHook } from '../../../hooks/useEnvHook';
import { PaperSource } from '../../../api/paper';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./demo.scss');

const dummyPaper: Paper = camelCaseKeys({
  id: 2406556600,
  title: 'Machine Learning in Adversarial Settings',
  year: 2016,
  published_date: '2016-05-01',
  doi: '10.1109/MSP.2016.51',
  volume: '14',
  issue: '3',
  author_count: 3,
  reference_count: 7,
  cited_count: 22,
  journal: null,
  conference_instance: {
    id: 2334792722,
    conference_series: {
      id: 1163618098,
      name: 'IEEE Symposium on Security and Privacy',
      name_abbrev: 'S&P',
      paper_count: 3222,
      citation_count: 151629,
    },
    name: 'IEEE S&P 2016',
    location: 'San Jose, USA',
    official_url: 'http://www.ieee-security.org/TC/SP2016/',
    start_date: '2016-05-23',
    end_date: '2016-05-25',
    abstract_registration_date: null,
    submission_deadline_date: null,
    notification_due_date: '2015-02-07',
    final_version_due_date: null,
    paper_count: 186,
    citation_count: 2377,
  },
  authors: [
    {
      id: 2056207806,
      name: 'Patrick D. McDaniel',
      affiliation: null,
      paper_count: 258,
      citation_count: 14634,
      order: 1,
      hindex: 55,
      profile_image_url: null,
      is_layered: false,
    },
    {
      id: 248975517,
      name: 'Nicolas Papernot',
      affiliation: {
        id: 130769515,
        name: 'Pennsylvania State University',
        name_abbrev: 'PSU',
      },
      paper_count: 42,
      citation_count: 2554,
      order: 2,
      hindex: null,
      profile_image_url: null,
      is_layered: false,
    },
    {
      id: 2250297608,
      name: 'Z. Berkay Celik',
      affiliation: {
        id: 130769515,
        name: 'Pennsylvania State University',
        name_abbrev: 'PSU',
      },
      paper_count: 23,
      citation_count: 913,
      order: 3,
      hindex: 8,
      profile_image_url: null,
      is_layered: false,
    },
  ],
  fos_list: [],
  urls: [],
  abstract: null,
  title_highlighted: '<b>Machine</b><b> Learning</b> in Adversarial Settings',
  abstract_highlighted:
    'Recent advances in <b>machine</b><b> learning</b> have led to innovative applications and services that use computational structures to reason about complex phenomenon. Over the past several years, the security and <b>machine</b><b>-learning</b> communities have developed novel techniques for constructing adversarial samples--malicious inputs crafted to mislead (and therefore corrupt the integrity of) systems built on computationally learned models. The authors consider the underlying causes of adversarial samples and the future countermeasures that might mitigate them.',
  figures: [],
  missing_keywords: [],
  relation: null,
  is_layered: false,
});

const PaperItemDemo: React.FC = () => {
  useStyles(s);
  const { isOnClient } = useEnvHook();
  const [containerWidth, setContainerWidth] = React.useState('792');

  if (!isOnClient) return null;

  const availableVenueAuthorType: VenueAuthorType[] = ['block', 'line'];
  const omitAbstractOptions = [true, false];
  const pageType = 'paperShow';
  const actionArea = 'demo-action-area';

  const paperItemsWithoutAbstractAndButtons = availableVenueAuthorType.map((type, i) => (
    <div key={i} className={s.paperItemBox}>
      <div className={s.defaultPaperItemWrapper}>
        <PaperItem paper={dummyPaper} pageType={pageType} actionArea={actionArea} omitAbstract venueAuthorType={type} />
      </div>
      <div className={s.description}>
        <div>{`venueAuthorType: ${type}, omit abstract: true, omit buttons: true`}</div>
      </div>
    </div>
  ));

  function getBasicPaperItems(paper: Paper, furtherInformation: string, source?: PaperSource) {
    return availableVenueAuthorType.map(venueAuthorType =>
      omitAbstractOptions.map((omitAbstract, i) => (
        <div key={i} className={s.paperItemBox}>
          <div className={s.defaultPaperItemWrapper}>
            <PaperItem
              paper={paper}
              pageType={pageType}
              actionArea={actionArea}
              omitAbstract={omitAbstract}
              venueAuthorType={venueAuthorType}
            />
            <PaperItemButtonGroup
              paperSource={source}
              paper={paper}
              pageType={pageType}
              actionArea={actionArea}
              saved={!!paper.relation && paper.relation.savedInCollections.length > 0}
            />
          </div>
          <div className={s.description}>
            <div>{`venueAuthorType: ${venueAuthorType}, omit abstract: ${omitAbstract}`}</div>
            <div>{furtherInformation}</div>
          </div>
        </div>
      ))
    );
  }

  function getCollectionPaperItems(paperWithNote: any, furtherInformation: string, source?: PaperSource) {
    return availableVenueAuthorType.map(venueAuthorType =>
      omitAbstractOptions.map((omitAbstract, i) => (
        <div key={i} className={s.paperItemBox}>
          <div className={s.defaultPaperItemWrapper}>
            <PaperItem
              paper={paperWithNote.paper}
              pageType={pageType}
              actionArea={actionArea}
              omitAbstract={omitAbstract}
              venueAuthorType={venueAuthorType}
            />
            <CollectionPaperItemButtonGroup
              paper={paperWithNote.paper}
              pageType={pageType}
              actionArea={actionArea}
              note={paperWithNote.note}
              collectionId={1}
              paperSource={source}
            />
          </div>
          <div className={s.description}>
            <div>{`venueAuthorType: ${venueAuthorType}, omit abstract: ${omitAbstract}`}</div>
            <div>{furtherInformation}</div>
          </div>
        </div>
      ))
    );
  }

  const basicPaperItems = getBasicPaperItems(dummyPaper, '');
  const noSourceItems = getBasicPaperItems({ ...dummyPaper, doi: '', urls: [] }, 'no source');
  const noSourceCollectionItems = getCollectionPaperItems(
    {
      ...paperWithNote,
      paper: {
        ...paperWithNote.paper,
        doi: '',
        urls: [],
      },
    },
    'no source collection items'
  );
  const noCitationBasicItems = getBasicPaperItems({ ...dummyPaper, citedCount: 0 }, 'no citation count');
  const noCitationCollectionItems = getCollectionPaperItems(
    {
      ...paperWithNote,
      paper: {
        ...paperWithNote.paper,
        citedCount: 0,
      },
    },
    'no citation count'
  );
  const savedCollectionItems = getBasicPaperItems(
    {
      ...dummyPaper,
      relation: {
        savedInCollections: [
          {
            id: 1,
            title: 'dummy',
            readLater: false,
            updatedAt: 'Thu Sep 05 2019 15:42:56 GMT+0900',
          },
        ],
      },
    },
    'saved collection'
  );
  const smallAbstractPaperItem = getBasicPaperItems(
    { ...dummyPaper, abstractHighlighted: dummyPaper.abstractHighlighted!.slice(0, 200) },
    'small abstract (< 250)'
  );
  const paperItemWithoutPublishedDate = getBasicPaperItems({ ...dummyPaper, publishedDate: '' }, 'no published date');
  const paperItemWithoutJournalName = getBasicPaperItems(
    { ...dummyPaper, venue: '', journal: null, conferenceInstance: null },
    'no journal name'
  );
  const basicPaperItemsWithSource = getBasicPaperItems(dummyPaper, 'has source icon', paperSource);
  const longTitlePaperItems = getBasicPaperItems(
    {
      ...dummyPaper,
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam',
    },
    'Long Title'
  );
  const hasFigurePaperItems = getBasicPaperItems(
    paperWithFigureAndManyAuthors,
    'has figure, many authors, sci, if label'
  );
  const authorVariationItems = [0, 1, 2, 3, 4].map(authorCount => {
    return getBasicPaperItems(
      {
        ...paperWithFigureAndManyAuthors,
        authorCount,
        authors: paperWithFigureAndManyAuthors.authors.slice(0, authorCount),
      },
      `has ${authorCount} authors`
    );
  });
  const collectionPaperItems = getCollectionPaperItems(
    { ...paperWithNote, note: '' },
    'collection show paper item, no note'
  );
  const collectionPaperItemsWithSource = getCollectionPaperItems(
    { ...paperWithNote, note: '' },
    'collection show paper item, no note',
    paperSource
  );
  const collectionPaperItemsHasNote = getCollectionPaperItems(paperWithNote, 'collection show paper item, has note');

  return (
    <div
      className={s.container}
      style={{
        width: `${containerWidth}px`,
      }}
    >
      <h1 className={s.title}>Paper Item museum</h1>
      <div className={s.optionSection}>
        <div>
          <div>
            <small style={{ display: 'block', textAlign: 'right' }}>default(search result): 792</small>
            <small style={{ display: 'block', textAlign: 'right' }}>maximum(container size): 1200</small>
            <small style={{ display: 'block', textAlign: 'right' }}>minimum: 320(iphone 4, 5)</small>
          </div>
          <span>{`current container width: `}</span>
          <input value={containerWidth} onChange={e => setContainerWidth(e.currentTarget.value)} />
        </div>
      </div>
      {basicPaperItems}
      {noSourceItems}
      {smallAbstractPaperItem}
      {noCitationBasicItems}
      {paperItemWithoutJournalName}
      {paperItemWithoutPublishedDate}
      {authorVariationItems}
      {paperItemsWithoutAbstractAndButtons}
      {basicPaperItemsWithSource}
      {longTitlePaperItems}
      {hasFigurePaperItems}
      {collectionPaperItems}
      {collectionPaperItemsWithSource}
      {collectionPaperItemsHasNote}
      {noCitationCollectionItems}
      {savedCollectionItems}
      {noSourceCollectionItems}
    </div>
  );
};

export default PaperItemDemo;
