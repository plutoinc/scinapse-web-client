jest.unmock("../articleInfo");

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import ArticleInfo, { IArticleInfoProps } from "../articleInfo";

describe("<ArticleInfo /> component", () => {
  let articleInfoWrapper: ShallowWrapper<IArticleInfoProps>;
  const mockUser = {
    email: "sdfds",
    fullName: "MockUser",
    memberId: 2332,
  };
  const mockFrom = "Arxiv";
  const mockCreatedAt = "July 17, 2017";

  beforeEach(() => {
    articleInfoWrapper = shallow(<ArticleInfo from={mockFrom} createdBy={mockUser} createdAt={mockCreatedAt} />);
  });

  it("should match snapshot", () => {
    expect(articleInfoWrapper.html()).toMatchSnapshot();
  });
});
