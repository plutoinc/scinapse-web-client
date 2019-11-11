import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { MemoryRouter, Route } from 'react-router';
import { Provider } from 'react-redux';
import { generateMockStore } from '../../../__tests__/mockStore';
import { initialState } from '../../../reducers';
import JournalShowContainer from '..';
import { RAW } from '../../../__mocks__';
import { JOURNAL_SHOW_PATH } from '../../../constants/routes';

jest.mock('../../../api/journal');

describe('JournalShow Container Component', () => {
  let mockStore = generateMockStore(initialState);

  beforeEach(() => {
    mockStore.clearActions();
  });

  describe('when journal data exist', () => {
    beforeEach(async () => {
      const journalPaper = RAW.JOURNAL_PAPERS_RESPONSE.data.content[0];

      const mockState = {
        ...initialState,
        journalShow: {
          ...initialState.journalShow,
          journalId: 2764552960,
          paperCurrentPage: 1,
          paperIds: ['8107'],
          paperTotalPage: 1,
        },
        entities: {
          ...initialState.entities,
          journals: { [`${RAW.JOURNAL.id}`]: RAW.JOURNAL },
          papers: { [`${journalPaper.id}`]: journalPaper },
        },
      };
      mockStore = generateMockStore(mockState);
    });

    it.skip('should render correctly', () => {
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter initialIndex={0} initialEntries={['/journals/2764552960']}>
              <Route path={JOURNAL_SHOW_PATH}>
                {/*Route is needed for providing match params*/}
                <JournalShowContainer />
              </Route>
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
