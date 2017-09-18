jest.unmock("../authorList");

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import AuthorList, { IAuthorListProps } from "../authorList";

const mockUser = {
  nickName: "Jeffrey C. Lagarias",
  organization: "University of Michigan",
};

describe("<AuthorList /> component", () => {
  let authorListWrapper: ShallowWrapper<IAuthorListProps>;
  let mockAuthors;

  describe("when author is more than 3", () => {
    beforeEach(() => {
      mockAuthors = [mockUser, mockUser, mockUser, mockUser, mockUser];
      authorListWrapper = shallow(<AuthorList authors={mockAuthors} />);
    });

    it("should match snapshot", () => {
      expect(authorListWrapper.html()).toMatchSnapshot();
    });
  });

  describe("when author is less than 3", () => {
    beforeEach(() => {
      mockAuthors = [mockUser, mockUser];
      authorListWrapper = shallow(<AuthorList authors={mockAuthors} />);
    });

    it("should match snapshot", () => {
      expect(authorListWrapper.html()).toMatchSnapshot();
    });
  });
});
