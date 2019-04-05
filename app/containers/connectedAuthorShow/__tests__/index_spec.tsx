jest.mock("../../../api/author");
jest.mock("react-truncate");

import * as React from "react";
import * as renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { MemoryRouter, Route } from "react-router-dom";
import { generateMockStore } from "../../../__tests__/mockStore";
import { initialState } from "../../../reducers";
import ConnectedAuthorShow from "../../../containers/connectedAuthorShow";
import { RAW } from "../../../__mocks__";
import { AUTHOR_SHOW_PATH } from "../../../constants/routes";
import { camelCaseKeys } from "../../../helpers/camelCaseKeys";

describe("ConnectedAuthorShow Component", () => {
  const mappedAuthor = camelCaseKeys(RAW.AUTHOR);
  let mockStore = generateMockStore(initialState);
  let mockState: any;

  describe("when there is no all publications", () => {
    beforeEach(() => {
      mockStore.clearActions();

      mockState = {
        ...initialState,
        connectedAuthorShow: {
          ...initialState.connectedAuthorShow,
          authorId: 2258681040,
          paperIds: [],
          coAuthorIds: [],
          papersTotalPage: 1,
          papersCurrentPage: 1,
          papersTotalCount: 1,
        },
        entities: {
          ...initialState.entities,
          authors: { "2258681040": mappedAuthor },
        },
      };

      mockStore = generateMockStore(mockState);
    });

    it("should render no publications at the content section", () => {
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter initialIndex={0} initialEntries={["/authors/2258681040"]}>
              <Route path={AUTHOR_SHOW_PATH}>
                <ConnectedAuthorShow />
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
        ...initialState,
        connectedAuthorShow: {
          ...initialState.connectedAuthorShow,
          authorId: 2258681040,
          paperIds: [RAW.PAPER.id],
          coAuthorIds: [],
          papersTotalPage: 1,
          papersCurrentPage: 1,
          papersTotalCount: 1,
        },
        entities: {
          ...initialState.entities,
          authors: { "2258681040": mappedAuthor },
          papers: { [`${RAW.PAPER.id}`]: RAW.PAPER },
        },
      };

      mockStore = generateMockStore(mockState);
    });

    it("should render content correctly", () => {
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter initialIndex={0} initialEntries={["/authors/2258681040"]}>
              <Route path={AUTHOR_SHOW_PATH}>
                <ConnectedAuthorShow />
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
        ...initialState,
        connectedAuthorShow: {
          ...initialState.connectedAuthorShow,
          authorId: 2258681040,
          isLoadingPapers: true,
          coAuthorIds: [],
          papersTotalPage: 1,
          papersCurrentPage: 1,
          papersTotalCount: 1,
        },
        entities: {
          ...initialState.entities,
          authors: { "2258681040": mappedAuthor },
        },
      };

      mockStore = generateMockStore(mockState);
    });

    it("should render loading spinner correctly", () => {
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter initialIndex={0} initialEntries={["/authors/2258681040"]}>
              <Route path={AUTHOR_SHOW_PATH}>
                <ConnectedAuthorShow />
              </Route>
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
