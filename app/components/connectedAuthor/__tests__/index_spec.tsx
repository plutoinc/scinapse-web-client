import * as React from "react";
import * as renderer from "react-test-renderer";
import { MemoryRouter, Route } from "react-router";
import { Provider } from "react-redux";
import { generateMockStore } from "../../../__tests__/mockStore";
import { initialState } from "../../../reducers";
import ConnectedAuthorShow from "..";
import { AUTHOR_SHOW_PATH } from "../../../routes";
import { LAYOUT_INITIAL_STATE } from "../../layouts/records";
import { RAW } from "../../../__mocks__";
import { AUTHOR_SHOW_INITIAL_STATE } from "../../../containers/authorShow/reducer";
import { CONFIGURATION_INITIAL_STATE } from "../../../reducers/configuration";
import { CURRENT_USER_INITIAL_STATE } from "../../../model/currentUser";
import { mapRawAuthor } from "../../../model/author/author";

describe("ConnectedAuthorShow Component", () => {
  const mockStore = generateMockStore(initialState);
  let mockState: any;

  describe("when there is no all publications", () => {
    beforeEach(() => {
      mockStore.clearActions();

      mockState = {
        layout: LAYOUT_INITIAL_STATE,
        author: mapRawAuthor(RAW.AUTHOR),
        coAuthors: [],
        papers: [],
        authorShow: AUTHOR_SHOW_INITIAL_STATE,
        configuration: CONFIGURATION_INITIAL_STATE,
        currentUser: CURRENT_USER_INITIAL_STATE,
        dispatch: mockStore.dispatch,
      };
    });

    it("should render no publications at the content section", () => {
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter initialIndex={0} initialEntries={["/authors/2764552960"]}>
              <Route path={AUTHOR_SHOW_PATH}>
                {/*Route is needed for providing match params*/}
                <ConnectedAuthorShow {...mockState} />
              </Route>
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("when all publications exist", () => {
    beforeEach(() => {
      mockStore.clearActions();

      mockState = {
        layout: LAYOUT_INITIAL_STATE,
        author: mapRawAuthor(RAW.AUTHOR),
        coAuthors: [],
        papers: [RAW.PAPER],
        authorShow: AUTHOR_SHOW_INITIAL_STATE,
        configuration: CONFIGURATION_INITIAL_STATE,
        currentUser: CURRENT_USER_INITIAL_STATE,
        dispatch: mockStore.dispatch,
      };
    });

    it("should render content correctly", () => {
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter initialIndex={0} initialEntries={["/authors/2764552960"]}>
              <Route path={AUTHOR_SHOW_PATH}>
                {/*Route is needed for providing match params*/}
                <ConnectedAuthorShow {...mockState} />
              </Route>
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("when try to load all publications", () => {
    beforeEach(() => {
      mockStore.clearActions();

      mockState = {
        layout: LAYOUT_INITIAL_STATE,
        author: mapRawAuthor(RAW.AUTHOR),
        coAuthors: [],
        papers: [RAW.PAPER],
        authorShow: { ...AUTHOR_SHOW_INITIAL_STATE, isLoadingPapers: true },
        configuration: CONFIGURATION_INITIAL_STATE,
        currentUser: CURRENT_USER_INITIAL_STATE,
        dispatch: mockStore.dispatch,
      };
    });

    it("should render loading spinner correctly", () => {
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter initialIndex={0} initialEntries={["/authors/2764552960"]}>
              <Route path={AUTHOR_SHOW_PATH}>
                {/*Route is needed for providing match params*/}
                <ConnectedAuthorShow {...mockState} />
              </Route>
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
