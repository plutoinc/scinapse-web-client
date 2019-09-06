import React from 'react';
import { useDispatch } from 'react-redux';
import PaperItem from './paperItem';
import PaperItemButtonGroup from './paperItemButtonGroup';
import CollectionPaperItemButtonGroup from './collectionPaperItemButtonGroup';
import { VenueAuthorType } from './venueAuthors';
import { Paper } from '../../../model/paper';
import { dummyPaper, paperSource, paperWithFigureAndManyAuthors, paperWithNote } from './paperData';
import { useEnvHook } from '../../../hooks/useEnvHook';
import { PaperSource } from '../../../api/paper';
import { setDeviceType, UserDevice } from '../../layouts/reducer';
const useStyles = require('isomorphic-style-loader/useStyles');
const s = require('./demo.scss');

const PaperItemDemo: React.FC = () => {
  useStyles(s);
  const { isOnClient } = useEnvHook();
  const dispatch = useDispatch();
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
        maxWidth: `${containerWidth}px`,
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
          <input
            value={containerWidth}
            onChange={e => {
              const nextValue = e.currentTarget.value;
              setContainerWidth(nextValue);
              if (parseInt(nextValue, 10) <= 768) {
                dispatch(setDeviceType({ userDevice: UserDevice.MOBILE }));
              } else {
                dispatch(setDeviceType({ userDevice: UserDevice.DESKTOP }));
              }
            }}
          />
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
