jest.unmock("../type");

import * as React from "react";
import Type, { ITypeProps } from "../type";
import { shallow, ShallowWrapper } from "enzyme";

describe("<TagList /> component", () => {
  let tagListWrapper: ShallowWrapper<ITypeProps>;
  const mockTag = "Open Access Paper";

  beforeEach(() => {
    tagListWrapper = shallow(<Type tags={mockTag} />);
  });

  it("should match snapshot", () => {
    expect(tagListWrapper.html()).toMatchSnapshot();
  });
});
