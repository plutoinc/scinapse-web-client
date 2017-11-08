jest.unmock("../summary");

import * as React from "react";
import { ShallowWrapper } from "enzyme";
import ReviewSummary, { IReviewSummaryProps } from "../summary";
import { RECORD } from "../../../../__mocks__";
import { shallowWithMuiThemeContext } from "../../../../__tests__/enzymeHelper";

// TODO: Remove skip when material-ui's getMuiTheme feature is fixed. it's broken now
describe.skip("<ReviewSummary /> component", () => {
  let articleInfoWrapper: ShallowWrapper<IReviewSummaryProps>;

  beforeEach(() => {
    articleInfoWrapper = shallowWithMuiThemeContext(
      <ReviewSummary MakeScorllGoToReviewSection={() => {}} article={RECORD.ARTICLE} />,
    );
  });

  it("should match snapshot", () => {
    expect(articleInfoWrapper.html()).toMatchSnapshot();
  });
});
