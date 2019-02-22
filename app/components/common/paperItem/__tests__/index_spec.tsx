import * as React from "react";
import * as renderer from "react-test-renderer";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import PaperItem from "..";
import { RAW } from "../../../../__mocks__";
import { CURRENT_USER_INITIAL_STATE } from "../../../../model/currentUser";
import { generateMockStore } from "../../../../__tests__/mockStore";
import { initialState } from "../../../../reducers";

describe("PaperItem Component", () => {
  const mockStore = generateMockStore(initialState);
  describe("when paper data has DOI", () => {
    it("should render correctly", () => {
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter>
              <PaperItem pageType="paperShow" paper={RAW.PAPER} currentUser={CURRENT_USER_INITIAL_STATE} />
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe("when paper data doesn't have DOI", () => {
    it("should render correctly", () => {
      const mockPaper = { ...RAW.PAPER, doi: "" };
      const tree = renderer
        .create(
          <Provider store={mockStore}>
            <MemoryRouter>
              <PaperItem pageType="paperShow" paper={mockPaper} currentUser={CURRENT_USER_INITIAL_STATE} />
            </MemoryRouter>
          </Provider>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
