import * as React from 'react';
import * as renderer from 'react-test-renderer';
import { MemoryRouter, Route } from 'react-router';
import { Provider } from 'react-redux';
import { generateMockStore } from '../../../__tests__/mockStore';
import { initialState } from '../../../reducers';
import HomeContainer from '..';
import { HOME_PATH } from '../../../constants/routes';

// TODO: react-test-renderer doesn't support React Hooks yet. It's merged to React source code, not deployed yet.
describe.skip('HomeContainer Component', () => {
  const mockStore = generateMockStore(initialState);

  beforeEach(() => {
    mockStore.clearActions();
  });

  it('should render content correctly', () => {
    const tree = renderer
      .create(
        <Provider store={mockStore}>
          <MemoryRouter initialIndex={0} initialEntries={['/journals/2764552960']}>
            <Route path={HOME_PATH}>
              {/*Route is needed for providing match params*/}
              <HomeContainer />
            </Route>
          </MemoryRouter>
        </Provider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
