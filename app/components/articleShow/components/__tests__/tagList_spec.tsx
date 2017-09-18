jest.unmock("../tagList");

import * as React from "react";
import TagList, { ITagListProps } from "../tagList";
import { shallow, ShallowWrapper } from "enzyme";

describe("<TagList /> component", () => {
  let tagListWrapper: ShallowWrapper<ITagListProps>;
  const mockTags = ["Open Access Paper", "Tylor Shin Awesome"];

  beforeEach(() => {
    tagListWrapper = shallow(<TagList tags={mockTags} />);
  });

  it("should match snapshot", () => {
    expect(tagListWrapper.html()).toMatchSnapshot();
  });
});
