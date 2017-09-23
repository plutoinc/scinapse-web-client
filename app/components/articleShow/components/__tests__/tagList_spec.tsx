jest.unmock("../tagList");

import * as React from "react";
import TagList, { ITagListProps } from "../tagList";
import { shallow, ShallowWrapper } from "enzyme";

describe("<TagList /> component", () => {
  let tagListWrapper: ShallowWrapper<ITagListProps>;
  const mockTag = "Open Access Paper";

  beforeEach(() => {
    tagListWrapper = shallow(<TagList tags={mockTag} />);
  });

  it("should match snapshot", () => {
    expect(tagListWrapper.html()).toMatchSnapshot();
  });
});
