import * as React from "react";
import * as renderer from "react-test-renderer";
import { MemoryRouter } from "react-router";
import RawPaperItem from "..";
import { RAW } from "../../../../__mocks__";
import { CURRENT_USER_INITIAL_STATE } from "../../../../model/currentUser";

describe("PaperItem Component", () => {
  describe("when paper data has DOI", () => {
    it("should render correctly", () => {
      const tree = renderer
        .create(
          <MemoryRouter>
            <RawPaperItem paper={RAW.PAPER} currentUser={CURRENT_USER_INITIAL_STATE} />
          </MemoryRouter>
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
          <MemoryRouter>
            <RawPaperItem paper={mockPaper} currentUser={CURRENT_USER_INITIAL_STATE} />
          </MemoryRouter>
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
