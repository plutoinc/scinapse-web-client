jest.unmock("../articleInfo");

import * as React from "react";
import { shallow, ShallowWrapper } from "enzyme";
import ArticleInfo, { IArticleInfoProps } from "../articleInfo";
import { RAW } from "../../../../__mocks__/index";
import { recordifyMember } from "../../../../model/member";

describe("<ArticleInfo /> component", () => {
  let articleInfoWrapper: ShallowWrapper<IArticleInfoProps>;
  const mockUser = recordifyMember(RAW.MEMBER);
  const mockFrom = "Arxiv";
  const mockCreatedAt = "July 17, 2017";

  beforeEach(() => {
    articleInfoWrapper = shallow(<ArticleInfo from={mockFrom} createdBy={mockUser} createdAt={mockCreatedAt} />);
  });

  it("should match snapshot", () => {
    expect(articleInfoWrapper.html()).toMatchSnapshot();
  });
});
