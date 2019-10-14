import * as React from 'react';
import * as renderer from 'react-test-renderer';
import BlockVenue from '../blockVenue';
import { RAW } from '../../../../__mocks__';

describe('BlockVenue Component', () => {
  describe('when paper is from conference', () => {
    it('should render correctly', () => {
      const paper = RAW.PAPER_FROM_CONFERENCE;

      const tree = renderer
        .create(
          <BlockVenue
            journal={paper.journal}
            conferenceInstance={paper.conferenceInstance}
            publishedDate={paper.publishedDate}
            year={paper.year}
            pageType="searchResult"
            actionArea="fakeArea"
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
