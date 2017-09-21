jest.unmock("../authorList");
import * as React from "react";
import { List } from "immutable";
import { shallow, ShallowWrapper } from "enzyme";

import { IAuthorRecord, recordifyAuthor } from "../../../../model/author";
import AuthorList from "../authorList";
import { RAW } from "../../../../__mocks__/index";

describe("<AuthorList /> component", () => {
  let authorListWrapper: ShallowWrapper<IAuthorRecord>;
  const mockAuthor = recordifyAuthor(RAW.AUTHOR);
  const mockAuthors = List([mockAuthor, mockAuthor, mockAuthor]);

  describe("when author is more than 3", () => {
    beforeEach(() => {
      authorListWrapper = shallow(<AuthorList authors={mockAuthors} />);
    });

    it("should match snapshot", () => {
      expect(authorListWrapper.html()).toMatchSnapshot();
    });
  });

  describe("when author is less than 3", () => {
    beforeEach(() => {
      authorListWrapper = shallow(<AuthorList authors={mockAuthors} />);
    });

    it("should match snapshot", () => {
      expect(authorListWrapper.html()).toMatchSnapshot();
    });
  });
});
