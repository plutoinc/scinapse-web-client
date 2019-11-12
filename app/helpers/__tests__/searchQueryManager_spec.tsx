jest.unmock('../searchQueryManager.ts');

import SearchQueryManager, { DEFAULT_FILTER } from '../searchQueryManager';

describe('SearchQueryManager', () => {
  describe('objectifyPaperFilter', () => {
    describe('when filter string is empty', () => {
      it('should return default object', () => {
        expect(SearchQueryManager.objectifyPaperFilter()).toEqual(DEFAULT_FILTER);
      });
    });

    describe('when filter string is undefined', () => {
      it('should return default object', () => {
        expect(SearchQueryManager.objectifyPaperFilter()).toEqual(DEFAULT_FILTER);
      });
    });

    describe('when filter string is other random string', () => {
      it('should return default object', () => {
        expect(SearchQueryManager.objectifyPaperFilter('scinapse is awesome')).toEqual(DEFAULT_FILTER);
      });
    });

    describe('when filter string is normal filters', () => {
      it('should return parsed object', () => {
        expect(
          SearchQueryManager.objectifyPaperFilter('year=2015:2019,fos=154945302,journal=933803995|2764999920|118988714')
        ).toEqual({
          yearFrom: 2015,
          yearTo: 2019,
          fos: ["154945302"],
          journal: [933803995, 2764999920, 118988714],
        });
      });
    });

    describe('when filter string is normal filters and journal filter is empty', () => {
      it('should return parsed object', () => {
        expect(SearchQueryManager.objectifyPaperFilter('year=2015:2019,fos=154945302,journal=')).toEqual({
          yearFrom: 2015,
          yearTo: 2019,
          fos: ["154945302"],
          journal: [],
        });
      });
    });

    describe('when filter string is normal filters and yearTo is empty', () => {
      it('should return parsed object', () => {
        expect(SearchQueryManager.objectifyPaperFilter('year=2015:,fos=154945302,journal=')).toEqual({
          yearFrom: 2015,
          yearTo: '',
          fos: ["154945302"],
          journal: [],
        });
      });
    });

    describe('when filter string exists and all filter is empty', () => {
      it('should return parsed object', () => {
        expect(SearchQueryManager.objectifyPaperFilter('year=:,fos=,journal=')).toEqual({
          yearFrom: '',
          yearTo: '',
          fos: [],
          journal: [],
        });
      });
    });
  });
});
