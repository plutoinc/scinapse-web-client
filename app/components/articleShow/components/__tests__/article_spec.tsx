jest.unmock("../article");

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import Article, { IArticleProps } from "../article";

describe("<Article /> component", () => {
  let articleWrapper: ShallowWrapper<IArticleProps>;
  const mockLink = "https://pluto.network";

  beforeEach(() => {
    articleWrapper = shallow(<Article link={mockLink} />);
  });

  it("should match snapshot", () => {
    expect(articleWrapper.html()).toMatchSnapshot();
  });
});
