jest.unmock("../type");

import * as React from "react";
import Type, { ITypeProps } from "../type";
import { shallow, ShallowWrapper } from "enzyme";
import { ARTICLE_CATEGORY } from "../../../articleCreate/records";

describe("<TagList /> component", () => {
  let tagListWrapper: ShallowWrapper<ITypeProps>;
  const mockTag: ARTICLE_CATEGORY = "POST_PAPER";

  beforeEach(() => {
    tagListWrapper = shallow(<Type tag={mockTag} />);
  });

  it("should match snapshot", () => {
    expect(tagListWrapper.html()).toMatchSnapshot();
  });
});
